/* eslint-disable @typescript-eslint/no-explicit-any */
// CAG Interface

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { prepare_prompt } from "./utils";

/**
 * Configuration options for CAG processing
 * @typedef {Object} CAGConfig
 * @property {number} chunkSize - Size of each text chunk in characters
 * @property {number} chunkOverlap - Number of overlapping characters between chunks
 * @property {number} [iteration_limit] - Maximum number of recursive processing iterations (2-100)
 * @property {number} [iteration_output_token_limit] - Maximum length of processed output before stopping
 */
type CAGConfig = {
  chunkSize: number;
  chunkOverlap: number;
  iteration_limit?: number;
  iteration_output_token_limit?: number;
};

/**
 * CAG (Chunked Augmented Generation) class for handling large text inputs with Chrome's built-in Gemini Nano.
 * This class implements intelligent chunking strategies to overcome context window limitations while
 * maintaining semantic coherence across processed chunks.
 *
 * @class
 * @example
 * ```typescript
 * const config = {
 *   chunkSize: 24576, // 6144 tokens * 4 chars/token
 *   chunkOverlap: 200,
 *   iteration_limit: 3,
 *   iteration_output_token_limit: 1000
 * };
 * const promptTemplate = "Summarize the following text: {text}";
 * const cag = new CAG(config, promptTemplate);
 * const result = await cag.generate_recursive(longText);
 * ```
 */
class CAG {
  _ai: any;
  _role: any;
  splitter: RecursiveCharacterTextSplitter;
  prompt_template: string;
  config: CAGConfig;

  /**
   * Creates a new CAG instance
   * @constructor
   * @param {CAGConfig} config - Configuration options for text chunking and processing
   * @param {string} prompt_template - Template string for AI prompts with {text} placeholder
   * @throws {Error} If configuration parameters are invalid
   */
  constructor(config: CAGConfig, prompt_template: string) {
    this._ai = null;
    this._role = null;
    this.splitter = this.setupSplitter(config);
    this.prompt_template = prompt_template;
    this.config = config;
    this.validateConfig(config);
  }

  /**
   * Validates the configuration parameters
   * @private
   * @param {CAGConfig} config - Configuration to validate
   * @throws {Error} If any configuration parameters are invalid
   */
  validateConfig = (config: CAGConfig) => {
    if (config.chunkSize < 1) {
      throw new Error("chunkSize must be greater than 0");
    }
    if (config.chunkOverlap < 0) {
      throw new Error("chunkOverlap must be greater than or equal to 0");
    }
    if (config.iteration_limit) {
      if (config.iteration_limit < 2) {
        throw new Error("iteration_limit must be greater than 1");
      }
      if (config.iteration_limit > 100) {
        throw new Error("iteration_limit must be less than or equal to 100");
      }
    }
    if (
      config.iteration_output_token_limit &&
      config.iteration_output_token_limit < 1
    ) {
      throw new Error("iteration_output_token_limit must be greater than 0");
    }
  };

  /**
   * Sets up the text splitter with configured chunk size and overlap
   * @private
   * @param {CAGConfig} config - Configuration for text splitting
   * @returns {RecursiveCharacterTextSplitter} Configured text splitter instance
   */
  setupSplitter = (config: CAGConfig) => {
    return new RecursiveCharacterTextSplitter({
      chunkSize: config.chunkSize,
      chunkOverlap: config.chunkOverlap,
    });
  };

  /**
   * Initializes the AI model instance
   * @private
   * @param {string} [aiType='languageModel'] - Type of AI model to initialize
   * @param {Object} [config={}] - Additional configuration for AI model
   * @returns {Promise<any>} Initialized AI model instance
   */
  initialize = async (aiType = "languageModel", config = {}) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return await window.ai[aiType].create(config);
  };

  /**
   * Processes input text sequentially in chunks
   * Sequential processing handles each chunk independently and combines results linearly.
   *
   * @param {string} longInput - Long text input to process
   * @returns {Promise<string>} Combined output from all chunks
   */
  generate_sequential = async (longInput: string): Promise<string> => {
    const chunks = await this.splitter.splitText(longInput);
    console.log("Chunks: ", chunks);
    console.log("Number of chunks: ", chunks.length);
    const output: string[] = [];
    for (const chunk of chunks) {
      this._ai = await this.initialize();
      console.log("Running chunk number: ", chunk);
      const prompt = prepare_prompt(this.prompt_template, chunk);
      const response = await this._ai.prompt(prompt);
      console.log("Response for chunk", response);
      output.push(response);
      await this._ai.destroy();
    }
    console.log("Output: ", output);
    return output.join("<br>");
  };

  /**
   * Processes input text recursively with refinement iterations
   * Recursive processing allows for progressive refinement of the output through multiple passes.
   *
   * @param {string} longInput - Long text input to process
   * @param {number} [iterationCount=0] - Current iteration count for recursive processing
   * @returns {Promise<string>} Refined output after processing
   * @throws {Error} If neither iteration_limit nor iteration_output_token_limit is set
   */
  generate_recursive = async (
    longInput: string,
    iterationCount = 0
  ): Promise<string> => {
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
      console.log("Iteration limit reached.");
      return longInput;
    }

    const chunks = await this.splitter.splitText(longInput);
    console.log(
      `Iteration ${iterationCount + 1}: Number of chunks`,
      chunks.length
    );

    const output: string[] = [];
    for (const chunk of chunks) {
      try {
        this._ai = await this.initialize();
        const prompt = prepare_prompt(this.prompt_template, chunk);
        const response = await this._ai.prompt(prompt);
        console.log(`Response for chunk: ${response}`);
        output.push(response);
        await this._ai.destroy();
      } catch (chunkError: any) {
        console.error(`Error processing chunk: "${chunk}"`, chunkError);
      } finally {
        if (this._ai) {
          await this._ai.destroy();
          this._ai = null; // Clear reference to ensure no stale object
        }
      }
    }

    const combinedOutput = output.join(" ");
    console.log(
      `Combined Output (Iteration ${iterationCount + 1}):`,
      combinedOutput
    );

    // Check if output token limit is reached
    if (
      this.config.iteration_output_token_limit &&
      combinedOutput.length <= this.config.iteration_output_token_limit
    ) {
      console.log("Output token limit satisfied.");
      return combinedOutput;
    }

    // Recursive call with new input
    return this.generate_recursive(combinedOutput, iterationCount + 1);
  };
}

export default CAG;
