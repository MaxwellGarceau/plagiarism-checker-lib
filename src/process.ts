import nlp from 'compromise'
import { appLogger } from './config/log4js';

function tokenize(text: string): string[] {
	const doc = nlp(text);
	return doc.terms().out('array');
}

function removeStopWords(tokens: string[]): string[] {
	const doc = nlp(tokens.join(' '));
	return doc
		.match('(#Noun|#Verb|#Adjective|#Adverb)')
		.terms()
		.out('array');
}

function cleanAndLemmatize(tokens: string[]): string[] {
	return tokens
		.map(word => {
			const cleanWord = word.replace(/[^\w\s]|_/g, "").toLowerCase();
			return nlp(cleanWord).verbs().toInfinitive().out('text') || cleanWord;
		})
		.filter(word => word !== '');
}

function process(text: string): string {
	appLogger.info('Original text:', text);
	
	const tokens = tokenize(text);
	const withoutStopWords = removeStopWords(tokens);
	const processed = cleanAndLemmatize(withoutStopWords);
	
	appLogger.info('Processed result:', processed);
	return processed.join(' ');
}

export default process;