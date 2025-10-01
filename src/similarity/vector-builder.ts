import { TFIDFTerm, VectorBuildResult } from '../interfaces/VectorTypes';

/**
 * Builds aligned vectors from TF-IDF terms for similarity comparison
 */
export class VectorBuilder {
	/**
	 * Creates a unified vocabulary from multiple document terms
	 * @param documentTerms Array of TF-IDF terms from different documents
	 * @returns Sorted array of unique terms
	 */
	private createVocabulary(documentTerms: TFIDFTerm[][]): string[] {
		const allTerms = documentTerms.flat().map(term => term.term);
		return Array.from(new Set(allTerms)).sort();
	}

	/**
	 * Builds aligned vectors for similarity comparison
	 * @param refDocTerms TF-IDF terms from reference document
	 * @param queryDocTerms TF-IDF terms from query document
	 * @returns Object containing vocabulary and aligned vectors
	 */
	buildVectors(refDocTerms: TFIDFTerm[], queryDocTerms: TFIDFTerm[]): VectorBuildResult {
		// Build aligned vectors across a unified vocabulary
		const vocabulary = this.createVocabulary([refDocTerms, queryDocTerms]);

		// Map terms to their TF-IDF scores
		const termToScoreRef = new Map<string, number>(
			refDocTerms.map(({ term, score }) => [term, score])
		);
		const termToScoreQuery = new Map<string, number>(
			queryDocTerms.map(({ term, score }) => [term, score])
		);

		// Build vectors aligned to the vocabulary
		const refVector = vocabulary.map(term => termToScoreRef.get(term) ?? 0);
		const queryVector = vocabulary.map(term => termToScoreQuery.get(term) ?? 0);

		return {
			vocabulary,
			refVector,
			queryVector
		};
	}
}
