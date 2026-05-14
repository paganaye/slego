// API Types - Minimal for client-server communication

export interface InitResponse {
  type: 'init';
  postId: string;
  username: string;
}

export interface SaveScoreRequest {
  score: number;
}

export interface SaveScoreResponse {
  success: boolean;
}

export interface ScoreEntry {
  username: string;
  score: number;
  date: string; //  toISOString()
}

export type HallOfFameResponse = ScoreEntry[];
