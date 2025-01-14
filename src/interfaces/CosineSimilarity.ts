interface CosineSimilarity {
	/**
	 * Compares two vectors (output of TF-IDF) and calculates their cosine similarity.
	 * @param vectorA - The first vector represented as an array of integers.
	 * @param vectorB - The second vector represented as an array of integers.
	 * @returns The cosine similarity score as a number between -1 and 1.
	 */
	compare(vectorA: number[], vectorB: number[]): number|null;
}

export { CosineSimilarity };
