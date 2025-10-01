# NLP Pipeline

## Processing

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

### Notes

- Vectors are always the same length because they are built from the unified vocabulary.
- If cosine similarity cannot be computed (e.g., both vectors are all zeros), an error is thrown.
- By default, the TF‑IDF implementation registry uses `natural`; see `src/init/tfidf.ts` to change defaults or register custom implementations.
