import nlp from 'compromise'
import { appLogger } from './config/log4js';
import { PipelineOutput, ProcessingStep, Tokenize } from './interfaces/PipelineOutput';

/**
 * Process the text by tokenizing, removing stop words, cleaning tokens, and lemmatizing
 * 
 * This function takes a string of text, processes it through a series of steps to clean and
 * transform the text into a more structured format. The steps include tokenizing the text into
 * individual words, removing common stop words, cleaning the tokens by removing punctuation
 * and making them lowercase, and finally lemmatizing the tokens to their base form.
 * 
 * The result is a list of lemmatized words that can be used for further analysis or
 * processing in text mining and natural language processing tasks.
 */
const process: PipelineOutput = (text: string): string => {
	appLogger.info('Original text:', text);
	
	const tokens = tokenize(text);
	const withoutStopWords = removeStopWords(tokens);
	const numbersToWords = convertNumbersToWords(withoutStopWords);
	const withoutPunctuation = removePunctuation(numbersToWords);
	const processed = lemmatizeTokens(withoutPunctuation);
	
	appLogger.info('Processed result:', processed);

	// TODO: Do we want to return the processed tokens as an array?
	// Join the processed tokens back into a string
	return processed.join(' ');
}

/**
 * Tokenize the text into individual words
 */
const tokenize: Tokenize = (text: string): string[] => {
	const doc = nlp(text);
	return doc.terms().out('array');
}

/**
 * Stop words are common words like "the", "is", "at", "which", and "on" that are filtered out
 * because they typically don't contribute meaningful value to text analysis. Removing them:
 * 1. Reduces noise in the text data
 * 2. Decreases processing time by reducing the amount of data
 * 3. Helps focus on the important content words (nouns, verbs, adjectives, adverbs)
 * 4. Improves efficiency of text analysis tasks like topic modeling and text classification
 */
const removeStopWords: ProcessingStep = (tokens: string[]): string[] => {
	const doc = nlp(tokens.join(' '));
	return doc
		.match('(#Noun|#Verb|#Adjective|#Adverb|#Value)')
		.terms()
		.out('array');
}

/**
 * Remove punctuation and make all words lowercase
 * Removes any character that is not a word character or whitespace
 * 
 * Example punctuation marks removed:
 * - Periods (.)
 * - Commas (,)
 * - Exclamation marks (!)
 * - Question marks (?)
 * - Colons (:)
 * - Semicolons (;)
 * - Dashes (-)
 * - Parentheses ( )
 * - Square brackets [ ]
 * - Curly braces { }
 * - Forward slashes (/)
 * - Backslashes (\)
 * - Single quotes (')
 * - Double quotes (")
 * - Asterisks (*)
 * - Plus signs (+)
 * - Equal signs (=)
 * - Angle brackets < >
 * - Ampersands (&)
 * - Pound signs (#)
 * - Dollar signs ($)
 * - Percent signs (%)
 * - At signs (@)
 * - Carets (^)
 * - Tildes (~)
 * - Backticks (`)
 * - Vertical bars (|)
 */
const removePunctuation: ProcessingStep = (tokens: string[]): string[] => {
	return tokens
		.map(word => word.replace(/[^\w\s]|_/g, "").toLowerCase())
		.filter(word => word !== '');
}

/**
 * Convert numbers to words
 * 
 * Example:
 * "1 2 3 4 5 6 7 8 9 0 1st 2nd 3rd 4th 5th 6th 7th 8th 9th 10th" -> "one two three four five six seven eight nine zero first second third fourth fifth sixth seventh eighth ninth tenth"
 */
const convertNumbersToWords: ProcessingStep = (tokens: string[]): string[] => {
	const doc = nlp(tokens.join(' '));
	doc.numbers().toText();
	return doc.terms().out('array');
}

/**
 * Lemmatize the tokens to their base form
 * 
 * Using the `compute` method to get the root of the word
 * 
 * TODO: Using nlp twice in order to format the output as an array
 * There's probably a better way to do this.
 */
const lemmatizeTokens: ProcessingStep = (tokens: string[]): string[] => {
	const doc = nlp(tokens.join(' '));
	return nlp(doc.compute('root').text('root')).out('array');
}

export default process;