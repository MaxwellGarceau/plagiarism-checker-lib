import { TFIDFExtractor } from '../interfaces/TFIDFExtractor';
import { appLogger } from '../config/log4js';

/**
 * A class that implements the TFIDFExtractor interface for computing term frequency,
 * inverse document frequency, and TF-IDF values.
 */
class TFIDFCustom implements TFIDFExtractor {
	private corpus: string[] = [];
	private idf: Record<string, number> = {};

	constructor() {
		// Constructor initializes with an empty corpus and IDF
	}

	/**
	 * Adds new documents to the corpus and updates the IDF values.
	 * @param newDocuments - An array of new documents to add.
	 */
	addDocuments(newDocuments: string[]): void {
		if (!Array.isArray(newDocuments) || newDocuments.some(doc => typeof doc !== 'string')) {
			throw new Error('Documents must be an array of strings.');
		}

		this.corpus.push(...newDocuments);
		this.idf = this.computeIDF(this.corpus); // Recompute IDF with updated corpus
	}

	/**
	 * Computes the term frequency (TF) of terms in a document.
	 * @param doc - The input document as a string.
	 * @returns An object mapping terms to their TF values.
	 */
	private computeTF(doc: string): Record<string, number> {
		const termCounts: Record<string, number> = {};
		const words = doc.split(/\s+/);
		const totalTerms = words.length;

		words.forEach(word => {
			termCounts[word] = (termCounts[word] || 0) + 1;
		});

		const tf: Record<string, number> = {};
		for (const term in termCounts) {
			tf[term] = termCounts[term] / totalTerms;
		}

		return tf;
	}

	private computeIDF(corpus: string[]): Record<string, number> {
		const docCount = corpus.length;
		const termDocCounts: Record<string, number> = {};
	
		// Count documents containing each term
		corpus.forEach(doc => {
			const uniqueTerms = new Set(doc.split(/\s+/));
			uniqueTerms.forEach(term => {
				termDocCounts[term] = (termDocCounts[term] || 0) + 1;
			});
		});
	
		const idf: Record<string, number> = {};
		for (const term in termDocCounts) {
			// Compute IDF using a stable formula
			idf[term] = Math.log((1 + docCount) / (1 + termDocCounts[term])) + 1;
		}
	
		return idf;
	}
	

	/**
	 * Calculates the TF-IDF for a term across all documents.
	 * @param term - The term to calculate TF-IDF for.
	 * @returns An array of TF-IDF values for the term in each document.
	 */
	calculateTFIDF(term: string): { documentIndex: number; measure: number }[] {
		appLogger.info(`Calculating TF-IDF for term: ${term}`);
		return this.corpus.map((doc, index) => {
			const tf = this.computeTF(doc);
			const result = {
				documentIndex: index,
				measure: (tf[term] || 0) * (this.idf[term] || 0),
			};
			appLogger.info(`Document #${index} has TF-IDF measure: ${result.measure}`);
			return result;

		});
	}

	/**
	 * Gets the top terms for a specific document.
	 * @param documentIndex - Index of the document to analyze.
	 * @param topN - Number of top terms to retrieve.
	 * @returns An array of terms with their TF-IDF scores.
	 */
	getTopTermsForDocument(documentIndex: number, topN: number | undefined = undefined): { term: string; score: number }[] {
		const doc = this.corpus[documentIndex];
		const tf = this.computeTF(doc);
		const tfidfScores: { term: string; score: number }[] = Object.keys(tf).map(term => ({
			term,
			score: tf[term] * (this.idf[term] || 0),
		}));

		return tfidfScores.sort((a, b) => b.score - a.score).slice(0, topN);
	}
}

export default TFIDFCustom;
