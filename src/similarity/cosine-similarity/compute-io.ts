import { CosineSimilarity } from "../../interfaces/CosineSimilarity";
import similarity from "compute-cosine-similarity";

class CosineSimilarityComputeIO implements CosineSimilarity {
	compare(vectorA: number[], vectorB: number[]): number|null {
		const result = similarity(vectorA, vectorB);

		/**
		 * Handle zero-magnitude vectors (e.g., [0, 0, 0]).
		 * 
		 * NOTE: Since the implementation of the `similarity` function is hidden from us,
		 * we explicitly guarantee that the reason we receive "NaN" is due to
		 * zero-magnitude vectors.
		 * 
		 * TODO: Make a PR to ComputeIO to handle NaN scenarios with errors
		 */
		if (Number.isNaN(result)) {
			throw new Error(
				`Invalid result: Cosine similarity cannot be calculated due to invalid input or zero-magnitude vectors. 
				Ensure both vectors have valid numeric values and non-zero magnitudes.`
			);
		}
		return result;
	}
}

export default CosineSimilarityComputeIO;