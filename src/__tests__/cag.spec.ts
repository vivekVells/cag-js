import CAG from "../cag";

// Mock window.ai
const mockPrompt = jest.fn().mockImplementation(() => "Processed text");
const mockDestroy = jest.fn().mockImplementation(() => {});
const mockCreate = jest.fn().mockImplementation(() => ({
  prompt: mockPrompt,
  destroy: mockDestroy,
}));

Object.defineProperty(global, "window", {
  value: {
    ai: {
      languageModel: {
        create: mockCreate,
      },
    },
  },
  writable: true,
});

describe("CAG Integration Tests", () => {
  let cag: CAG;

  beforeEach(() => {
    cag = new CAG(
      {
        chunkSize: 100,
        chunkOverlap: 20,
        iteration_limit: 3,
        iteration_output_token_limit: 500,
      },
      "Summarize: {text}"
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize CAG successfully", () => {
    expect(cag).toBeDefined();
    expect(cag).toBeInstanceOf(CAG);
  });

  test("should process text sequentially", async () => {
    const shortText = "This is a test text.";
    const result = await cag.generate_sequential(shortText);

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(mockCreate).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalled();
  });

  test("should process text recursively", async () => {
    const shortText = "This is a test text.";
    const result = await cag.generate_recursive(shortText);

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(mockCreate).toHaveBeenCalled();
    expect(mockPrompt).toHaveBeenCalled();
  });

  test("should throw error with invalid config", () => {
    expect(() => {
      new CAG(
        {
          chunkSize: -1,
          chunkOverlap: 20,
          iteration_limit: 3,
        },
        "Summarize: {text}"
      );
    }).toThrow();
  });
});
