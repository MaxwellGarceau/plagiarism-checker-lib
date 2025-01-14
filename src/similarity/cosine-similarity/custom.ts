import { CosineSimilarity } from "../../../src/interfaces/CosineSimilarity";

// Mock implementation of the CosineSimilarity interface for testing purposes
class CosineSimilarityCustom implements CosineSimilarity {
	compare(vectorA: number[], vectorB: number[]): number | null {
		if (vectorA.length !== vectorB.length) {
			throw new Error("Vectors must be the same length");
		}

		// Calculate dot product
		const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);

		// Calculate magnitudes
		const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
		const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));

		// Handle 0 vectors (e.g., [0, 0, 0])
		if (magnitudeA === 0 || magnitudeB === 0) {
			throw new Error(
				`Invalid result: Cosine similarity cannot be calculated due to invalid input or zero-magnitude vectors. 
				Ensure both vectors have valid numeric values and non-zero magnitudes.`
			);
		}
		return dotProduct / (magnitudeA * magnitudeB);
	}
}

export default CosineSimilarityCustom;
