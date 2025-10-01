/**
 * A term with its TF-IDF score
 */
export type TFIDFTerm = {
	term: string;
	score: number;
};

/**
 * Result of building aligned vectors from TF-IDF terms
 */
export type VectorBuildResult = {
	vocabulary: string[];
	refVector: number[];
	queryVector: number[];
};
