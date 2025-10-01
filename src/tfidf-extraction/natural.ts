import natural from 'natural';
import { TFIDFExtractor } from '../interfaces/TFIDFExtractor';
import { appLogger } from '../config/log4js';

/**
 * TFIDF Processor
 * This module calculates the TF-IDF values for terms in a set of processed documents.
 * It uses Natural's TF-IDF implementation to compute scores for term significance.
 */

class TFIDFNatural implements TFIDFExtractor {
	private tfidf: natural.TfIdf;

	constructor() {
		this.tfidf = new natural.TfIdf();
	}

	/**
	 * Add documents to the TF-IDF processor
	 * @param documents Array of pre-processed documents (cleaned text)
	 */
	addDocuments(documents: string[]): void {
		appLogger.info('Adding documents to TF-IDF processor.');
		documents.forEach((doc, index) => {
			this.tfidf.addDocument(doc);
			appLogger.info(`Document #${index + 1} added.`);
		});
	}

	/**
	 * Calculate TF-IDF for a term across all documents
	 * @param term The term to calculate TF-IDF for
	 * @returns An array of TF-IDF values for the term in each document
	 */
	calculateTFIDF(term: string): { documentIndex: number; measure: number }[] {
		appLogger.info(`Calculating TF-IDF for term: ${term}`);
		const tfidfValues: { documentIndex: number; measure: number }[] = [];

		this.tfidf.tfidfs(term, (index, measure) => {
			tfidfValues.push({ documentIndex: index, measure });
			appLogger.info(`Document #${index} has TF-IDF measure: ${measure}`);
		});

		return tfidfValues;
	}

	/**
	 * Get the terms with the highest TF-IDF values for a specific document
	 * @param documentIndex Index of the document to analyze
	 * @param topN Number of top terms to retrieve
	 * @returns An array of terms with their TF-IDF scores
	 */
	getTopTermsForDocument(documentIndex: number, topN: number | undefined = undefined): { term: string; score: number }[] {
		appLogger.info(`Getting top ${topN} terms for document #${documentIndex}`);
		const terms = this.tfidf.listTerms(documentIndex);
		return terms.slice(0, topN).map(term => ({ term: term.term, score: term.tfidf }));
	}
}

export default TFIDFNatural;
