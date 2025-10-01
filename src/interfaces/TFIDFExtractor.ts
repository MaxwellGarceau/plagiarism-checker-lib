/**
 * Interface for TFIDF Extraction
 */
interface TFIDFExtractor {
	/**
	 * Adds new documents to the corpus and updates internal calculations.
	 * @param newDocuments An array of new documents to add
	 */
	addDocuments(newDocuments: string[]): void;

	/**
	 * Calculate TF-IDF for a term across all documents.
	 * @param term The term to calculate TF-IDF for
	 * @returns An array of TF-IDF values for the term in each document
	 */
	calculateTFIDF(term: string): { documentIndex: number; measure: number }[];

	/**
	 * Get the top terms for a specific document.
	 * @param documentIndex Index of the document to analyze
	 * @param topN Number of top terms to retrieve
	 * @returns An array of terms with their TF-IDF scores
	 */
	getTopTermsForDocument(documentIndex: number, topN?: number): { term: string; score: number }[];
}

export { TFIDFExtractor };
