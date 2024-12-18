import nlp from 'compromise'
import { appLogger } from './config/log4js';

// Example function to process a text document
function process(text: string) {

	appLogger.info('Original text:', text);

    // Tokenize the text using compromise
    let doc = nlp(text);

    // Remove stop words
    let noStopWords = doc
        .match('(#Noun|#Verb|#Adjective|#Adverb)') // Match meaningful parts of speech
        .terms()
        .out('array');

	appLogger.info('noStopWords:', noStopWords);

    // Remove punctuation and lemmatize
    let processedWords = noStopWords.map((word: string) => {
        let cleanWord = word.replace(/[^\w\s]|_/g, "").toLowerCase(); // Remove punctuation and make lowercase
        let lemma = nlp(cleanWord).verbs().toInfinitive().out('text') || cleanWord; // Lemmatize
        return lemma;
    }).filter((word: string) => word !== ''); // Filter out empty strings

	appLogger.info('No punctuation and all words lemmatized:', processedWords);

    return processedWords.join(' ');
}

export default process;