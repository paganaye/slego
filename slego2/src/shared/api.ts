// API Types - Minimal for client-server communication

export interface InitResponse {
  type: 'init';
  postId: string;
  username: string;
}

export interface SaveScoreRequest {
  score: number;
  seed: string;
}

export interface SaveScoreResponse {
  success: boolean;
}

export interface ScoreEntry {
  username: string;
  score: number;
  game: string;
  date: string; //  toISOString()
}

export type HallOfFameResponse = ScoreEntry[];
