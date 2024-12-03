import { ReadableStream } from "web-streams-polyfill";
import "regenerator-runtime/runtime";

(global as any).ReadableStream = ReadableStream;
// This is a setup file, not a test file
