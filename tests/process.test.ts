import { describe, it, expect } from 'vitest';
import process from '../src/process';
import { appLogger } from '../src/config/log4js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('process', () => {
  it('should tokenize text, remove stop words and punctuation, and lemmatize words', () => {

    // Test input with stop words, punctuation and words to lemmatize
    const input = readFileSync(resolve(__dirname, './__fixtures/processing/raw.txt'), 'utf-8');
    
    // Process the text
    const result = process(input);

	appLogger.info(result);

    // Expected output after processing:
    // - No stop words (the, are, over, the)
    // - No punctuation (!)
    // - Lemmatized words (foxes -> fox, jumping -> jump)
    const expected = readFileSync(resolve(__dirname, './__fixtures/processing/expected.txt'), 'utf-8');

    expect(result).toBe(expected);
  });
});
