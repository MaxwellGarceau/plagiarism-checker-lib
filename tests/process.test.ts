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

  it('should convert numbers to words', () => {
    const input = '1 2 3 4 5 6 7 8 9 0 1st 2nd 3rd 4th 5th 6th 7th 8th 9th 10th';
    const result = process(input);
    expect(result).toBe('one two three four five six seven eight nine zero first second third fourth fifth sixth seventh eighth ninth tenth');
  });

  it('should normalize abbreviations, slang, and acronyms', () => {
    const input = 'I\'m gonna go to the store and get some groceries.';
    const result = process(input);
    expect(result).toBe('i is going to go store get grocery');
  });

  it('should fix spelling errors', () => {
    const input = 'I\'m gokna go to the stere and get some grocaries.';
    const result = process(input);
    expect(result).toBe('i is going to go store get grocery');
  });
});
