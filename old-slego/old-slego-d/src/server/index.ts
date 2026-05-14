import express from 'express';
import {
  SaveScoreRequest,
  SaveScoreResponse,
  HallOfFameResponse,
  ScoreEntry,
} from '@shared/api';
import { redis, reddit, createServer, getServerPort } from '@devvit/web/server';
import { createPost } from './core/post';

const app = express();
const MAX_SCORES = 50;

// Generates the Redis key for a given game seed.
const getScoresKey = (seed: string): string => `slego_scores:${seed}`;

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// --- Helper Functions ---

/**
 * Fetches and parses scores for a specific game seed from Redis.
 * Returns an empty array if scores are not found or if an error occurs.
 */
async function getScores(seed: string): Promise<ScoreEntry[]> {
  try {
    const scoresData = await redis.get(getScoresKey(seed));
    if (scoresData) {
      return JSON.parse(scoresData) as ScoreEntry[];
    }
  } catch (error) {
    console.error(`Error fetching or parsing scores from Redis for seed "${seed}":`, error);
  }
  return [];
}

/**
 * Saves scores for a specific game seed to Redis.
 */
async function saveScores(seed: string, scores: ScoreEntry[]): Promise<void> {
  try {
    await redis.set(getScoresKey(seed), JSON.stringify(scores));
  } catch (error) {
    console.error(`Redis save error for seed "${seed}":`, error);
    // Re-throw to be caught by the route handler
    throw new Error('Failed to save scores to Redis');
  }
}

// --- API Routes ---

router.post<{}, SaveScoreResponse | { status: string; message: string }, SaveScoreRequest>(
  '/api/save-score',
  async (req, res) => {
    try {
      const { score, seed } = req.body;

      if (typeof score !== 'number' || isNaN(score)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid score value',
        });
      }

      if (typeof seed !== 'string' || seed.trim() === '') {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid or missing seed',
        });
      }

      const username = await reddit.getCurrentUsername();
      if (!username) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      const scores = await getScores(seed);
      const existingEntryIndex = scores.findIndex((entry) => entry.username === username);

      if (existingEntryIndex !== -1) {
        // User has an existing score, check if the new one is better.
        let current = scores[existingEntryIndex]!;

        if (score > current.score) {
          console.log(`New best score for "${username}" in game "${seed}": ${score} (previous: ${current.score})`);
          current.score = score;
          current.date = new Date().toISOString();
        } else {
          console.log(`Score for "${username}" in game "${seed}" not improved: ${score} <= ${current.score}`);
          return res.json({ success: true });
        }
      } else {
        // First score for this user in this game.
        console.log(`First score for user "${username}" in game "${seed}": ${score}`);
        scores.push({ username, score, date: new Date().toISOString(), game: seed });
      }

      // Sort all scores and keep the top N.
      scores.sort((a, b) => b.score - a.score);
      const topScores = scores.slice(0, MAX_SCORES);

      await saveScores(seed, topScores);

      console.log(`Score of ${score} for user "${username}" in game "${seed}" processed successfully.`);
      res.json({ success: true });
    } catch (error) {
      console.error('Error in /api/save-score:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to save score',
      });
    }
  }
);

router.get<{}, HallOfFameResponse | { status: string; message: string }>('/api/hall-of-fame', async (req, res) => {
  try {
    const seed = req.query.seed as string;

    if (!seed) {
      return res.status(400).json({
        status: 'error',
        message: 'Game seed must be provided via query parameter.',
      });
    }

    const scores = await getScores(seed);

    // The list is already sorted on write, so we just need to slice.
    const topScores = scores.slice(0, 10);

    if (topScores.length === 0) {
      console.log(`No scores found for Hall of Fame for game "${seed}".`);
      res.json([]);
    } else {
      console.log(`Returning top 10 scores for Hall of Fame for game "${seed}".`);
      res.json(topScores);
    }
  } catch (error) {
    console.error('Error in /api/hall-of-fame:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to load hall of fame',
    });
  }
});

router.post('/internal/on-app-install', async (_req, res) => {
  try {
    console.log("/internal/on-app-install was run")
    return res.json({
      showToast: {
        text: `app installed`,
      },
    });
  } catch (err) {
    console.error(err);
  }
});



router.post('/internal/menu/post-create', async (_req, res) => {
  try {
    //console.log("/internal/menu/post-create was run")
    const post = await createPost();
    return res.json({
      showToast: {
        text: `Post créé: ${post?.id ?? ''}`,
        // variant: 'success', // si supporté par ta version
      },
    });
  } catch (err) {
    return res.json({
      showToast: {
        text: 'Échec de création du post ' + err,
        // variant: 'error',
      }
    });
  }
});


app.use(router);

const server = createServer(app);
server.on('error', (err) => console.error(`server error; ${err.stack}`));
server.listen(getServerPort());