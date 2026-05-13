import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'dist/client')));

// Mock data storage
let scores = [];
let userProgress = {
    username: 'local-player',
    completedLevels: [],
    highestUnlockedLevel: 1,
    tutorialCompleted: false,
    lastPlayed: new Date()
};

console.log('🚀 Starting local SLEGO server...');

// API Routes essentielles
app.get('/api/init', (req, res) => {
    console.log('📡 API: /api/init');
    res.json({
        type: 'init',
        postId: 'local-dev',
        username: 'local-player'
    });
});

app.post('/api/save-score', (req, res) => {
    const { score } = req.body;
    console.log(`📊 API: Saving score ${score}`);

    const scoreEntry = {
        username: 'local-player',
        score,
        date: new Date().toISOString()
    };

    scores.push(scoreEntry);
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 50);

    res.json({ success: true });
});

app.get('/api/hall-of-fame', (req, res) => {
    console.log('🏆 API: Hall of Fame');
    res.json(scores.slice(0, 10));
});

app.get('/api/game-stats', (req, res) => {
    console.log('📈 API: Game Stats');
    const totalGames = scores.length;
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    const highScore = Math.max(...scores.map(s => s.score), 0);

    res.json({
        totalGames,
        averageScore,
        highScore,
        totalPlayers: 1
    });
});

app.get('/api/user-progress', (req, res) => {
    console.log('👤 API: User Progress');
    res.json({
        username: userProgress.username,
        completedLevels: userProgress.completedLevels,
        highestUnlockedLevel: userProgress.highestUnlockedLevel,
        tutorialCompleted: userProgress.tutorialCompleted,
        lastPlayed: userProgress.lastPlayed.toISOString()
    });
});

app.post('/api/user-progress', (req, res) => {
    const { completedLevels, highestUnlockedLevel, tutorialCompleted } = req.body;
    console.log('💾 API: Saving user progress');

    userProgress.completedLevels = completedLevels;
    userProgress.highestUnlockedLevel = highestUnlockedLevel;
    userProgress.tutorialCompleted = tutorialCompleted;
    userProgress.lastPlayed = new Date();

    res.json({ success: true });
});

app.post('/api/complete-level', (req, res) => {
    const { levelId } = req.body;
    console.log(`🎯 API: Level ${levelId} completed`);

    if (!userProgress.completedLevels.includes(levelId)) {
        userProgress.completedLevels.push(levelId);
        userProgress.completedLevels.sort((a, b) => a - b);
    }

    const nextLevel = levelId + 1;
    if (nextLevel > userProgress.highestUnlockedLevel) {
        userProgress.highestUnlockedLevel = nextLevel;
    }

    res.json({ success: true });
});

// Routes de compétition basiques
app.post('/api/start-competition', (req, res) => {
    console.log('🏁 API: Starting competition');
    const gameId = `local-${Date.now()}`;
    const seed = Math.random().toString(36).substring(7);

    res.json({
        gameId,
        seed,
        sessionId: `session-${gameId}`
    });
});

app.post('/api/save-competition-result', (req, res) => {
    console.log('🏆 API: Competition result:', req.body);
    res.json({ success: true, rank: 1 });
});

// Catch-all for SPA routing. It should ignore API routes and must be the last route.
app.get(/^(?!\/api\/).*$/, (req, res) => {
    res.sendFile(join(__dirname, 'dist/client/index.html'));
});
app.listen(PORT, () => {
    console.log(`🎮 SLEGO local server started on http://localhost:${PORT}`);
    console.log('📁 Serving files from dist/client');
    console.log('🔧 Local development mode (without Reddit)');
    console.log('');
    console.log('🎯 Available APIs:');
    console.log('  - GET  /api/init');
    console.log('  - POST /api/save-score');
    console.log('  - GET  /api/hall-of-fame');
    console.log('  - GET  /api/game-stats');
    console.log('  - GET  /api/user-progress');
    console.log('  - POST /api/user-progress');
    console.log('  - POST /api/complete-level');
    console.log('  - POST /api/start-competition');
    console.log('  - POST /api/save-competition-result');
    console.log('');
});
