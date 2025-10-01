# Plagiarism Checker Library
A library for checking plagiarism in text documents using TFIDF extraction and cosine similarity.

## API: `isPlagiarism`

The main function that compares two text documents and returns `true` if the second document is likely plagiarized from the first. Uses TF-IDF vectorization and cosine similarity for robust text comparison.

```ts
function isPlagiarism(
  referenceDocument: string,
  queryDocument: string,
  args?: { threshold?: number }
): boolean
```

**Possible outcomes:**
- `true` - Documents are similar enough to be considered plagiarism (similarity ≥ threshold)
- `false` - Documents are sufficiently different (similarity < threshold)

The lower the threshold, the more sensitive the plagiarism check becomes (catches more cases including paraphrasing).

**Example with test data:**
```ts
const original = "The quick brown fox jumps over the lazy dog. This is a classic pangram...";
const heavyPlagiarism = "The quick brown fox **leaps quickly** over the lazy dog. This is a classic pangram... This version has a one word substitution and one new word added.";
const lightPlagiarism = "A fast brown fox leaps over a sleepy dog. This is a traditional pangram... This version has significant word substitutions and structural changes.";

// Strict threshold (0.8) - only catches heavy plagiarism
isPlagiarism(original, heavyPlagiarism, { threshold: 0.8 }); // true
isPlagiarism(original, lightPlagiarism, { threshold: 0.8 }); // false

// Default threshold (0.25) - catches both
isPlagiarism(original, heavyPlagiarism, { threshold: 0.25 }); // true  
isPlagiarism(original, lightPlagiarism, { threshold: 0.25 }); // true

// Sensitive threshold (0.1) - catches even light paraphrasing
isPlagiarism(original, lightPlagiarism, { threshold: 0.1 }); // true
```

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
