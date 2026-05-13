// Competition Manager - Client-side competition game management

/*
import { CompetitionClient } from '@shared/utils/competition-client';
import {
  StartCompetitionResponse,
  SaveCompetitionResultRequest,
} from '@shared/types/competition';

export interface CompetitionSession {
  gameId: string;
  sessionId: string;
  seed: string;
  startTime: Date;
  isActive: boolean;
}

export class CompetitionManager {
  private currentSession: CompetitionSession | null = null;
  private sessionStartTime: number = 0;

  /**
   * Start a new competition session
   * /
  async startNewCompetition(): Promise<CompetitionSession> {
    try {
      const response = await CompetitionClient.startCompetition();

      this.currentSession = {
        gameId: response.gameId,
        sessionId: response.sessionId,
        seed: response.seed,
        startTime: new Date(),
        isActive: true,
      };

      this.sessionStartTime = Date.now();

      console.log('Started new competition:', this.currentSession);
      return this.currentSession;
    } catch (error) {
      console.error('Failed to start competition:', error);
      throw error;
    }
  }

  /**
   * Start a competition with a specific seed
   * /
  async startCompetitionWithSeed(seed: string): Promise<CompetitionSession> {
    try {
      const response = await CompetitionClient.startCompetitionWithSeed(seed);

      this.currentSession = {
        gameId: response.gameId,
        sessionId: response.sessionId,
        seed: response.seed,
        startTime: new Date(),
        isActive: true,
      };

      this.sessionStartTime = Date.now();

      console.log('Started competition with seed:', this.currentSession);
      return this.currentSession;
    } catch (error) {
      console.error('Failed to start competition with seed:', error);
      throw error;
    }
  }

  /**
   * Start today's daily challenge
   * /
  async startDailyChallenge(): Promise<CompetitionSession> {
    const dailySeed = CompetitionClient.generateDailySeed();
    return this.startCompetitionWithSeed(dailySeed);
  }

  /**
   * Start current hour's challenge
   * /
  async startHourlyChallenge(): Promise<CompetitionSession> {
    const hourlySeed = CompetitionClient.generateHourlySeed();
    return this.startCompetitionWithSeed(hourlySeed);
  }

  /**
   * End the current competition and save results
   * /
  async endCompetition(
    score: number,
    completedRounds: number
  ): Promise<{ success: boolean; rank?: number }> {
    if (!this.currentSession) {
      throw new Error('No active competition session');
    }

    try {
      const duration = Date.now() - this.sessionStartTime;

      const request: SaveCompetitionResultRequest = {
        gameId: this.currentSession.gameId,
        sessionId: this.currentSession.sessionId,
        score,
        completedRounds,
        duration,
      };

      const result = await CompetitionClient.saveCompetitionResult(request);

      // Mark session as inactive
      this.currentSession.isActive = false;

      console.log('Competition ended:', result);
      return result;
    } catch (error) {
      console.error('Failed to end competition:', error);
      throw error;
    }
  }

  /**
   * Get current session information
   * /
  getCurrentSession(): CompetitionSession | null {
    return this.currentSession;
  }

  /**
   * Check if there's an active competition
   * /
  hasActiveCompetition(): boolean {
    return this.currentSession !== null && this.currentSession.isActive;
  }

  /**
   * Get current session duration in milliseconds
   * /
  getSessionDuration(): number {
    if (!this.currentSession) {
      return 0;
    }
    return Date.now() - this.sessionStartTime;
  }

  /**
   * Get formatted session duration
   * /
  getFormattedDuration(): string {
    const duration = this.getSessionDuration();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Clear current session (for cleanup)
   * /
  clearSession(): void {
    this.currentSession = null;
    this.sessionStartTime = 0;
  }

  /**
   * Get leaderboard for current session's seed
   * /
  async getCurrentLeaderboard(limit: number = 100) {
    if (!this.currentSession) {
      throw new Error('No active competition session');
    }

    return CompetitionClient.getSeedLeaderboard(this.currentSession.seed, limit);
  }

  /**
   * Get leaderboard for a specific seed
   * /
  async getLeaderboardForSeed(seed: string, limit: number = 100) {
    return CompetitionClient.getSeedLeaderboard(seed, limit);
  }

  /**
   * Get user's competition history
   * /
  async getUserHistory(limit: number = 50) {
    return CompetitionClient.getUserCompetitionHistory(limit);
  }

  /**
   * Get global competition statistics
   * /
  async getGlobalStats() {
    return CompetitionClient.getCompetitionStats();
  }

  /**
   * Get list of active seeds
   * /
  async getActiveSeeds() {
    return CompetitionClient.getActiveSeeds();
  }

  /**
   * Format seed for display
   * /
  formatSeed(seed: string): string {
    return CompetitionClient.formatSeedForDisplay(seed);
  }
}
*/