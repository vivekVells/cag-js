# CAG Algorithm (Chunked Augmented Generation)

A TypeScript library for processing large text inputs using AI models through chunking and recursive generation.

## Installation

```bash
npm install cag-algorithm
```

## Features

- Text chunking with configurable size and overlap
- Sequential and recursive processing modes
- Configurable iteration limits and output token limits
- TypeScript support
- Built on LangChain's text splitters

## Usage

```typescript
import { CAG } from 'cag-algorithm';

// Configure CAG
const config = {
  chunkSize: 1000,
  chunkOverlap: 200,
  iteration_limit: 5,
  iteration_output_token_limit: 2000
};

// Create prompt template
const promptTemplate = "Please summarize the following text: {text}";

// Initialize CAG
const cag = new CAG(config, promptTemplate);

// Process text sequentially
const sequentialResult = await cag.generate_sequential(longText);

// Process text recursively
const recursiveResult = await cag.generate_recursive(longText);
```

## Configuration Options

- `chunkSize`: Number of characters per chunk
- `chunkOverlap`: Number of characters to overlap between chunks
- `iteration_limit`: Maximum number of recursive iterations
- `iteration_output_token_limit`: Target length for output text

## Requirements

- Browser environment with `window.ai` available
- Node.js 14.0.0 or higher

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
