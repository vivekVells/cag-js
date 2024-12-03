import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { CAGConfig, AIInstance, AIConfig } from "./types";
import { validateConfig, prepare_prompt } from "./utils";

class CAG {
  private _ai: AIInstance | null;
  private readonly splitter: RecursiveCharacterTextSplitter;
  private readonly prompt_template: string;
  private readonly config: CAGConfig;

  constructor(config: CAGConfig, prompt_template: string) {
    this._ai = null;
    this.splitter = this.setupSplitter(config);
    this.prompt_template = prompt_template;
    this.config = config;
    validateConfig(config);
  }

  private setupSplitter(config: CAGConfig): RecursiveCharacterTextSplitter {
    return new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap,
    });
  }

  /**
   * Initialize AI instance
   * @param aiType Type of AI model to use
   * @param config Configuration for AI model
   * @returns Promise resolving to AI instance
   */
  public async initialize(
    aiType = "languageModel",
    config: AIConfig = {}
  ): Promise<AIInstance> {
    if (typeof window === "undefined") {
      throw new Error(
        "CAG requires a browser environment with window.ai available"
      );
    }
    // @ts-ignore
    return await window.ai[aiType].create(config);
  }

  /**
   * Generate output sequentially processing chunks
   * @param longInput Input text to process
   * @returns Promise resolving to processed output
   */
  public async generate_sequential(longInput: string): Promise<string> {
    const chunks = await this.splitter.splitText(longInput);
    const output: string[] = [];

    for (const chunk of chunks) {
      this._ai = await this.initialize();
      const prompt = prepare_prompt(this.prompt_template, chunk);
      const response = await this._ai.prompt(prompt);
      output.push(response);
      await this._ai.destroy();
    }

    return output.join("<br>");
  }

  /**
   * Generate output recursively processing chunks
   * @param longInput Input text to process
   * @param iterationCount Current iteration count
   * @returns Promise resolving to processed output
   */
  public async generate_recursive(
    longInput: string,
    iterationCount = 0
  ): Promise<string> {
    if (
      !this.config.iteration_limit &&
      !this.config.iteration_output_token_limit
    ) {
      throw new Error(
        "Either iteration_limit or iteration_output_token_limit must be set."
      );
    }

    if (
      this.config.iteration_limit &&
      iterationCount >= this.config.iteration_limit
    ) {
      return longInput;
    }

    const chunks = await this.splitter.splitText(longInput);
    const output: string[] = [];

    for (const chunk of chunks) {
      this._ai = await this.initialize();
      const prompt = prepare_prompt(this.prompt_template, chunk);
      const response = await this._ai.prompt(prompt);
      output.push(response);
      await this._ai.destroy();
    }

    const combinedOutput = output.join(" ");

    if (
      this.config.iteration_output_token_limit &&
      combinedOutput.length <= this.config.iteration_output_token_limit
    ) {
      return combinedOutput;
    }

    return this.generate_recursive(combinedOutput, iterationCount + 1);
  }
}

export default CAG;
