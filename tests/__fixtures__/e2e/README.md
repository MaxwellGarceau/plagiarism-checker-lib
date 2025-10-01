# E2E Test Fixtures

This directory contains test fixtures for end-to-end testing of the plagiarism detector.

## Test Documents

### `original-document.txt`
The baseline document used for comparison. Contains a classic pangram with additional context about typography and design.

### `identical-document.txt`
An exact copy of the original document. Should be detected as 100% plagiarism.

### `heavy-plagiarism.txt`
Contains the original text with minor additions. Should be detected as high-level plagiarism (>0.8 similarity).

### `moderate-plagiarism.txt`
Contains the original text with word substitutions and reordering. Should be detected as moderate plagiarism.

### `light-plagiarism.txt`
Contains the original text with significant word substitutions and structural changes. Should be detected as light plagiarism.

### `no-plagiarism.txt`
A completely different document about machine learning. Should not be detected as plagiarism.

### `empty-document.txt`
An empty document for testing edge cases.

### `single-word.txt`
A single word document for testing minimal content scenarios.

## Test Scenarios

The E2E tests cover:

1. **Basic Detection**: Identical, heavy, moderate, and light plagiarism scenarios
2. **Threshold Variations**: Testing different similarity thresholds (0.1 to 0.95)
3. **Edge Cases**: Empty documents, single words, special characters
4. **Document Processing**: Numbers, mixed case, whitespace handling
5. **Error Handling**: Null inputs, stop words only
6. **Performance**: Consistency, large documents, symmetry
7. **Real-world Scenarios**: Academic plagiarism, paraphrasing, citations

## Expected Results

- **Identical documents**: Always detected as plagiarism
- **Heavy plagiarism**: Detected with default threshold (0.8)
- **Moderate plagiarism**: Detected with default threshold (0.8)
- **Light plagiarism**: May or may not be detected depending on threshold
- **No plagiarism**: Never detected as plagiarism
- **Edge cases**: Handled gracefully without errors
