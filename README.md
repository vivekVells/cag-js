# CAG (Chunked Augmented Generation)

CAG is a TypeScript library that implements the Chunked Augmented Generation algorithm for efficiently processing large text inputs with AI language models. It automatically handles token limits and context windows by intelligently breaking down text into manageable chunks while preserving context coherence.

## How It Works

CAG operates in two main modes:

1. **Sequential Processing**

   - Splits text into overlapping chunks
   - Processes each chunk independently
   - Combines results sequentially
   - Ideal for parallel processing and maintaining text structure

2. **Recursive Processing**
   - Splits text into overlapping chunks
   - Processes chunks hierarchically
   - Recursively combines and refines outputs
   - Perfect for summarization and progressive refinement

## Features

- 🔄 Two Processing Modes: Sequential and Recursive
- 📏 Configurable chunk sizes and overlap
- ⚙️ Customizable iteration limits and output controls
- 🔍 Built on LangChain's text splitters
- 📚 Full TypeScript support

## Installation

```bash
npm install cag
```

## Quick Start Example

```typescript
import { CAG } from "cag";

// Initialize CAG
const cag = new CAG(
  {
    chunkSize: 1000, // Characters per chunk
    chunkOverlap: 200, // Overlap between chunks
    iteration_limit: 5, // Max recursive iterations
    iteration_output_token_limit: 2000, // Target output length
  },
  "Summarize the following text: {text}"
);

// Process text sequentially
const text = "Your long text here...";
const summary = await cag.generate_sequential(text);

// Or process recursively
const recursiveSummary = await cag.generate_recursive(text);
```

## Configuration Options

```typescript
interface CAGConfig {
  chunkSize: number; // Number of characters per chunk
  chunkOverlap: number; // Characters to overlap between chunks
  iteration_limit?: number; // Maximum recursive iterations
  iteration_output_token_limit?: number; // Target length for output
}
```

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cag.git
cd cag
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. Run tests:

```bash
npm test
```

## Local Testing

To test CAG in a local project:

1. Link the package locally:

```bash
# In the CAG package directory
npm run build
npm link
```

2. Create a test project:

```bash
mkdir cag-test
cd cag-test
npm init -y
```

3. Link to your local CAG:

```bash
npm link cag
```

4. Create a test file (index.ts):

```typescript
import { CAG } from "cag";

async function main() {
  const cag = new CAG(
    {
      chunkSize: 1000,
      chunkOverlap: 200,
      iteration_limit: 3,
    },
    "Summarize: {text}"
  );

  const result = await cag.generate_sequential("Your long text here...");

  console.log(result);
}

main().catch(console.error);
```

## Usage Examples

### Basic Summarization

```typescript
import { CAG } from "cag";

const cag = new CAG(
  {
    chunkSize: 1000,
    chunkOverlap: 200,
  },
  "Summarize this text briefly: {text}"
);

const summary = await cag.generate_sequential(longText);
```

### Recursive Processing for Long Documents

```typescript
import { CAG } from "cag";

const cag = new CAG(
  {
    chunkSize: 2000,
    chunkOverlap: 200,
    iteration_limit: 3,
    iteration_output_token_limit: 1000,
  },
  "Extract key points from this text: {text}"
);

const analysis = await cag.generate_recursive(longDocument);
```

## Browser Compatibility

CAG requires a browser environment with `window.ai` available. Ensure your environment has the necessary AI capabilities before using the library.

## Requirements

- Browser environment with window.ai
- Node.js ≥ 14.0.0
- TypeScript ≥ 4.0.0 (for development)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- Vivek Vellaiyappn Surulimuthu

## Support

- Create an issue in the [GitHub repository](https://github.com/yourusername/cag/issues)
- See the [documentation](https://github.com/yourusername/cag#readme) for updates

## Acknowledgments

Built with:

- [LangChain](https://js.langchain.com/docs/) text splitters
- TypeScript
- window.ai interface
