/**
 * Prepares a prompt by replacing a placeholder with the actual text
 * @param template The prompt template with {text} placeholder
 * @param text The text to insert into the template
 * @returns Prepared prompt string
 */
export const prepare_prompt = (template: string, text: string): string => {
  return template.replace('{text}', text);
};

/**
 * Validates the CAG configuration
 * @param config The CAG configuration object
 * @throws Error if configuration is invalid
 */
export const validateConfig = (config: {
  chunkSize: number;
  chunkOverlap: number;
  iteration_limit?: number;
  iteration_output_token_limit?: number;
}): void => {
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
  if (config.iteration_output_token_limit && config.iteration_output_token_limit < 1) {
    throw new Error("iteration_output_token_limit must be greater than 0");
  }
};
