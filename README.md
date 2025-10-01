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

- [Pipeline](./docs/pipeline.md) - NLP pipeline and TF-IDF to cosine similarity integration
- [Architecture](./docs/architecture.md) - Design principles and architectural decisions
