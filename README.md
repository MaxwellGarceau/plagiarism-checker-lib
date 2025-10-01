# Plagiarism Checker Library
A library for checking plagiarism in text documents.

## Interpreting similarity

Cosine similarity is a number in [0, 1] here (with TF‑IDF, negatives are rare). Higher means more similar.

- 0.9–1.0: Near-duplicate content; strong evidence of plagiarism
- 0.7–0.9: High overlap; likely plagiarism or heavy reuse
- 0.4–0.7: Moderate overlap; paraphrasing or partial reuse is likely
- 0.1–0.4: Light overlap; similar topic/terms, weak plagiarism signal
- 0.0–0.1: Unrelated content

Threshold trade‑off (similarity ≥ threshold → plagiarism):
- Lower threshold (e.g., 0.1–0.3) = more sensitive, catches paraphrases but increases false positives
- Higher threshold (e.g., 0.8–0.95) = more strict, flags near‑duplicates but may miss paraphrases

Examples with default threshold 0.25:
- Identical documents → ~1.0 → flagged
- Paraphrasing (synonyms/order changes) → ~0.25–0.5 → flagged
- Different topics → ~0.0–0.1 → not flagged

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

## Documentation

- [Architecture](./docs/architecture.md) - Design principles and architectural decisions

## NLP Pipeline (process)

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

### Vector Builder
The vector builder aligns TF‑IDF terms from two documents onto a unified, deterministic vocabulary and produces equal‑length numeric vectors.

- **Location**: `src/similarity/vector-builder.ts`
- **Input**: `refDocTerms`, `queryDocTerms` (arrays of `{ term: string; score: number }`)
- **Output**: `{ vocabulary: string[], refVector: number[], queryVector: number[] }`
- **How it works**:
  - Creates a union vocabulary from both documents' terms and sorts it for stable ordering
  - Maps each vocabulary term to its TF‑IDF score in each document; missing terms → 0
  - Returns equal‑length vectors suitable for cosine similarity

Example:

```ts
import { VectorBuilder } from './src/similarity/vector-builder';

const builder = new VectorBuilder();
const { vocabulary, refVector, queryVector } = builder.buildVectors(refDocTerms, queryDocTerms);
```

### Cosine Similarity Calculation
- **threshold**: Optional similarity cutoff in [0, 1]. Defaults to `0.25`.
Computes cosine similarity between the two aligned vectors and applies a plagiarism threshold.

- **Location**: `src/similarity/cosine-similarity/compute-io.ts`
- **API**: `compare(vectorA: number[], vectorB: number[]): number | null`
- **Implementation details**:
  - Uses `compute-cosine-similarity` under the hood
  - Throws if the result is `NaN` (e.g., zero‑magnitude vectors)
  - Vectors must be the same length (the vector builder guarantees this)

Integration in `src/index.ts` (`isPlagiarism`):

```ts
const similarity = cosine.compare(refVector, queryVector);
const { threshold = 0.25 } = args;
return similarity >= threshold;
```

- **threshold**: Optional similarity cutoff in [0, 1]. Defaults to `0.25` (lower = more sensitive; higher = more strict).

#### Additional guards in `isPlagiarism`:
- Blank vs blank documents → returns `false`
- Identical raw strings → returns `true`
- No overlapping non‑zero TF‑IDF terms between documents → returns `false`
- **threshold**: Optional similarity cutoff in [0, 1]. Defaults to `0.25`.

### Notes

- Vectors are always the same length because they are built from the unified vocabulary.
- If cosine similarity cannot be computed (e.g., both vectors are all zeros), an error is thrown.
- By default, the TF‑IDF implementation registry uses `natural`; see `src/init/tfidf.ts` to change defaults or register custom implementations.
