export interface CAGConfig {
  chunkSize: number;
  chunkOverlap: number;
  iteration_limit?: number;
  iteration_output_token_limit?: number;
}

export interface AIInstance {
  prompt: (text: string) => Promise<string>;
  destroy: () => Promise<void>;
}

export interface AIConfig {
  [key: string]: any;
}
