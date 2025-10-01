# Plagiarism Checker Library
A library for checking plagiarism in text documents.

## Quick Start

```ts
import isPlagiarism from 'plagiarism-checker-lib';

const reference = 'This is the original document content...';
const query = 'This is a potentially plagiarized document...';

// Optional: override similarity threshold (default: 0.25)
const result = isPlagiarism(reference, query, { threshold: 0.3 });

console.log(result); // true if cosine similarity >= threshold
```

## Setup
- `nvm use && npm install`
- `npm run dev`

## Tests
Vitest is used to write unit tests.

- `npm run test`

## Developer Notes

## App Architecture
This library follows a functional programming approach rather than an object-oriented one. Since we don't need to maintain state between operations, using pure functions provides several benefits:

- **Modularity**: Each file exports a single function that performs one specific task, making the code easier to understand, test, and maintain
- **Predictability**: Pure functions always produce the same output for a given input, eliminating side effects and making debugging simpler
- **Testability**: Functions that don't maintain state are easier to unit test since we only need to verify input/output relationships
- **Composability**: Small, focused functions can be combined to create more complex operations while keeping the code organized

The architecture emphasizes keeping functions small, pure, and focused on a single responsibility. This allows us to build complex plagiarism detection logic by composing simpler, well-tested functions together.

### Project Structure

- `src/`: Source code for the library.
- `tests/`: Test cases for the library.
- `dist/`: Compiled output of the library.
- `package.json`: Project metadata and build scripts.
- `tsconfig.json`: TypeScript configuration.
- `eslint.config.js`: ESLint configuration.
- `vitest.config.ts`: Vitest configuration.

## NLP Pipeline

- **Processing (`src/process/process.ts`)**: Cleans text input by lowercasing, removing punctuation and stop words, lemmatizing, and normalizing numbers to words.
- **TF‑IDF Extraction (`src/tfidf-extraction/`)**: Multiple implementations conform to `TFIDFExtractor`:
  - `natural`: Wraps `natural.TfIdf` for robust weighting and term listing.
  - `custom`: Lightweight internal TF/IDF calculator for experimentation.
- **Cosine Similarity (`src/similarity/cosine-similarity/`)**:
  - `compute-io`: Uses `compute-cosine-similarity` for similarity between two numeric vectors.
  - `custom`: A pure TypeScript implementation used in tests.

## TF‑IDF → Cosine Similarity Integration

The library constructs equal-length vectors by aligning TF‑IDF terms across a unified vocabulary:

1. Process both documents with the same cleaning pipeline.
2. Add both processed docs to a TF‑IDF extractor (default: `natural`).
3. Get top terms and scores for each document via `getTopTermsForDocument(index)`.
4. Build a unified vocabulary = union of both documents' terms (sorted for deterministic ordering).
5. Create vectors by mapping each vocabulary term to its TF‑IDF score in each document (missing terms → 0).
6. Compute cosine similarity on these two equal-length vectors.

This wiring lives in `src/index.ts` within the `isPlagiarism` function and returns `true` when similarity ≥ threshold (default 0.25).

### API: `isPlagiarism`

```ts
function isPlagiarism(
  referenceDocument: string,
  queryDocument: string,
  args?: { threshold?: number }
): boolean
```

- **threshold**: Optional similarity cutoff in [0, 1]. Defaults to `0.25`.

### Notes

- Vectors are always the same length because they are built from the unified vocabulary.
- If cosine similarity cannot be computed (e.g., both vectors are all zeros), an error is thrown.
- By default, the TF‑IDF implementation registry uses `natural`; see `src/init/tfidf.ts` to change defaults or register custom implementations.
