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
const SCORES_KEY = 'slego_scores';
const MAX_SCORES = 50;

// Middleware for JSON body parsing
app.use(express.json());
// Middleware for URL-encoded body parsing
app.use(express.urlencoded({ extended: true }));
// Middleware for plain text body parsing
app.use(express.text());

const router = express.Router();

// --- Helper Functions ---

/**
 * Fetches and parses scores from Redis.
 * Returns an empty array if scores are not found or if an error occurs.
 */
async function getScores(): Promise<ScoreEntry[]> {
  try {
    const scoresData = await redis.get(SCORES_KEY);
    if (scoresData) {
      // Assuming ScoreEntry[] is the correct type for the parsed data.
      return JSON.parse(scoresData) as ScoreEntry[];
    }
  } catch (error) {
    console.error('Error fetching or parsing scores from Redis:', error);
  }
  return [];
}

/**
 * Saves scores to Redis.
 */
async function saveScores(scores: ScoreEntry[]): Promise<void> {
  try {
    await redis.set(SCORES_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error('Redis save error:', error);
    // Re-throw to be caught by the route handler
    throw new Error('Failed to save scores to Redis');
  }
}

// --- API Routes ---

router.post<{}, SaveScoreResponse | { status: string; message: string }, SaveScoreRequest>(
  '/api/save-score',
  async (req, res) => {
    try {
      const { score } = req.body;

      if (typeof score !== 'number' || isNaN(score)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid score value',
        });
      }

      const username = await reddit.getCurrentUsername();
      if (!username) {
        return res.status(401).json({
          status: 'error',
          message: 'User not authenticated',
        });
      }

      // Note: This read-modify-write operation is not atomic and could lead to a race
      // condition under high concurrency. For a high-traffic app, consider using
      // Redis transactions (MULTI/EXEC) or a Lua script for atomicity.
      const scores = await getScores();
      const existingEntryIndex = scores.findIndex((entry) => entry.username === username);

      if (existingEntryIndex !== -1) {
        // User has an existing score, check if the new one is better.
        let current = scores[existingEntryIndex]!;

        if (score > current.score) {
          console.log(`New best score for "${username}": ${score} (previous: ${current.score})`);
          current.score = score;
          current.date = new Date().toISOString();
        } else {
          console.log(`Score for "${username}" not improved: ${score} <= ${current.score}`);
          // Score is not better, no need to save anything.
          return res.json({ success: true });
        }
      } else {
        // First score for this user.
        console.log(`First score for user "${username}": ${score}`);
        scores.push({ username, score, date: new Date().toISOString() });
      }

      // Sort all scores and keep the top N.
      scores.sort((a, b) => b.score - a.score);
      const topScores = scores.slice(0, MAX_SCORES);

      await saveScores(topScores);

      console.log(`Score of ${score} for user "${username}" processed successfully.`);
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

router.get<{}, HallOfFameResponse | { status: string; message: string }>(
  '/api/hall-of-fame',
  async (_req, res) => {
    try {
      const scores = await getScores();

      // The list is already sorted on write, so we just need to slice.
      const topScores = scores.slice(0, 10);

      if (topScores.length === 0) {
        console.log('No scores found for Hall of Fame.');
        res.json([]);
      } else {
        console.log('Returning top 10 scores for Hall of Fame.');
        res.json(topScores);
      }
    } catch (error) {
      console.error('Error in /api/hall-of-fame:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to load hall of fame',
      });
    }
  }
);




router.post('/internal/on-app-install', async (_req, res) => {
  try {
    console.log("/internal/on-app-install was run")
    return res.json({
      showToast: {
        text: `app installed`,
      },
    });
  } catch (err) {
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
