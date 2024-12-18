import { describe, it, expect } from 'vitest';
import process from '../src/process';
import { appLogger } from '../src/config/log4js';

describe('process', () => {
  it('should tokenize text, remove stop words and punctuation, and lemmatize words', () => {

	// TODO: Replace test input with song lyrics
    // Test input with stop words, punctuation and words to lemmatize
    const input = "The quick brown foxes are jumping over the lazy dogs!";
    
    // Process the text
    const result = process(input);

	appLogger.info(result);

    // Expected output after processing:
    // - No stop words (the, are, over, the)
    // - No punctuation (!)
    // - Lemmatized words (foxes -> fox, jumping -> jump)
    const expected = "quick brown fox jump lazy dog";

    expect(result).toBe(expected);
  });
});
