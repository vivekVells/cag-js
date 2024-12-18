# CAG (Chunked Augmented Generation)

CAG is a TypeScript library specifically designed to overcome context window limitations in browser-based AI models, with particular optimization for Chrome's built-in Gemini Nano implementation. It enables efficient processing of large text inputs by intelligently managing chunk boundaries while maintaining semantic coherence.

## Overview

CAG addresses the fundamental challenge of processing large inputs within browser-based AI models' restricted context windows. It employs sophisticated chunking strategies and browser-specific optimizations to extend the effective processing capacity while maintaining performance stability.

### Practical Example: Document Summarization

Imagine you have a 100-page research paper in your browser that you need to summarize. Without CAG, you'd hit context window limits trying to process it all at once. Here's how CAG handles it:

```typescript
import { CAG } from "cag-js";

// Initialize CAG with settings optimized for document summarization
const cag = new CAG({
  chunkSize: 24576,  // About 6,144 tokens, optimal for Gemini Nano
  chunkOverlap: 4096,  // Ensures context continuity between sections
  iteration_limit: 3,   // Number of refinement passes
  iteration_output_token_limit: 2048  // Target summary length
}, "Summarize the following text section, focusing on key findings: {text}");

// Your 100-page research paper as text
const researchPaper = `[Your long research paper content...]`;

// Generate a coherent summary
try {
  const summary = await cag.generate_recursive(researchPaper);
  console.log("Research Paper Summary:", summary);
} catch (error) {
  console.error("Error generating summary:", error);
}
```

What happens behind the scenes:

1. CAG splits your 100-page paper into overlapping chunks that fit Gemini Nano's context window
2. Each chunk is summarized while maintaining connections to surrounding content
3. These summaries are combined and refined over multiple passes
4. You get a coherent, well-structured summary of the entire paper, processed entirely in your browser

## Key Features

- 🔄 Dual Processing Modes: Sequential and Recursive Generation
- 📏 Intelligent Chunk Management with Context Preservation
- ⚙️ Browser-Optimized Resource Management
- 🔍 Chrome Gemini Nano Integration
- 📊 Comprehensive Performance Metrics
- 🛡️ Privacy-Preserving Local Processing
- 📚 Full TypeScript Support

## Installation

```bash
npm install cag-js
```

## Try it Out: CAG-JS Playground

Want to see CAG in action before integrating it into your project? Check out the [CAG-JS Playground](https://github.com/vivekVells/cag-js-example) - an interactive environment where you can experiment with CAG's capabilities using Chrome's built-in Gemini Nano model.

The playground provides:

- 🎮 Live examples of content processing
- 📝 Ready-to-use components
- 🔍 Interactive testing environment
- 💡 Implementation examples

To get started with the playground:

1. Install Chrome Canary
2. Enable Gemini Nano support in `chrome://flags`:
   - Enable "Prompt API for Gemini Nano"
   - Enable "Enables optimization guide on device"
3. Clone and run the playground:

   ```bash
   git clone https://github.com/vivekVells/cag-js-example
   cd cag-js-example
   npm install
   npm run dev
   ```

## Usage

### Basic Implementation

```typescript
import { CAG } from "cag-js";

const cag = new CAG({
  chunkSize: 24576,  // Optimized for Chrome's Gemini Nano context window
  chunkOverlap: 4096,
  iteration_limit: 5,
  iteration_output_token_limit: 6144  // Gemini Nano token limit
}, "Process the following text: {text}");

// Sequential Processing
const result = await cag.generate_sequential(longText);

// Recursive Processing
const recursiveResult = await cag.generate_recursive(longText);
```

### Configuration

```typescript
interface CAGConfig {
  chunkSize: number;         // Characters per chunk (recommended: 24576 for Gemini Nano)
  chunkOverlap: number;      // Overlap between chunks
  iteration_limit?: number;  // Maximum recursive iterations
  iteration_output_token_limit?: number;  // Target output length in tokens
}
```

## Processing Modes

### Sequential Generation

- Processes chunks independently in sequence
- Maintains document structure
- Ideal for parallel processing
- Best for content where chunks can be processed independently

### Recursive Generation

- Hierarchical chunk processing
- Progressive refinement of output
- Maintains semantic coherence across chunks
- Optimal for summarization and content transformation

## Performance Considerations

CAG's performance has been extensively benchmarked across different content lengths:

- Small (CWQ ≤ 1): Optimal for content within single context window
- Medium (1 < CWQ ≤ 2): Efficient dual-window processing
- Large (2 < CWQ ≤ 3): Balanced performance with chunk coordination
- Extra Large (3 < CWQ ≤ 4): Sophisticated chunk management
- Humongous (CWQ > 4): Advanced resource optimization

Where CWQ (Context Window Quotient) = Content Length / (Base Token Window × Character-to-Token Ratio)

## Browser Requirements

- Chrome with Gemini Nano support
- Minimum 4GB available memory
- WebAssembly support
- Hardware acceleration recommended

## Use Cases

- Document Summarization
- Content Expansion
- Technical Documentation Processing
- Large-Scale Text Analysis
- Knowledge Base Processing
- Multi-Stage Content Refinement

## Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cag-js.git
cd cag-js
```

2. Install dependencies:

```bash
npm install
```

3. Build:

```bash
npm run build
```

4. Test:

```bash
npm test
```

## Error Handling

CAG implements robust error handling for:

- Browser resource constraints
- Context window limitations
- Chunk processing failures
- Memory management issues

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/enhancement`
3. Commit changes: `git commit -m 'Add enhancement'`
4. Push: `git push origin feature/enhancement`
5. Submit Pull Request

## License

MIT License - see [LICENSE](LICENSE) file

<!-- 
## Authors

- Vivek Vellaiyappan Surulimuthu
- Aditya Karnam Gururaj Rao

## Citations

When using CAG in academic work, please cite:

```bibtex
@article{surulimuthu2024cag,
  title={CAG: Chunked Augmented Generation for Google Chrome's Built-in Gemini Nano},
  author={Surulimuthu, Vivek Vellaiyappan and Rao, Aditya Karnam Gururaj},
  year={2024}
}
``` -->

## Support

- [GitHub Issues](https://github.com/yourusername/cag-js/issues)
- [Documentation](https://github.com/yourusername/cag-js#readme)

## Acknowledgments

Built with:

- Chrome's Gemini Nano Implementation
- LangChain Text Splitters
- TypeScript
