import { describe, it, expect } from "vitest";
import CosineSimilarityComputeIO from "../../../src/similarity/cosine-similarity/compute-io";

const cosineSimilarity = new CosineSimilarityComputeIO();

describe("CosineSimilarity.compare", () => {
	it("should return 1 for identical vectors", () => {
		const vectorA = [1, 2, 3];
		const vectorB = [1, 2, 3];
		const result = cosineSimilarity.compare(vectorA, vectorB);
		expect(result).toBeCloseTo(1, 5);
	});

	it("should return 0 for orthogonal vectors", () => {
		const vectorA = [1, 0, 0];
		const vectorB = [0, 1, 0];
		const result = cosineSimilarity.compare(vectorA, vectorB);
		expect(result).toBeCloseTo(0, 5);
	});

	it("should return -1 for completely opposite vectors", () => {
		const vectorA = [1, 2, 3];
		const vectorB = [-1, -2, -3];
		const result = cosineSimilarity.compare(vectorA, vectorB);
		expect(result).toBeCloseTo(-1, 5);
	});

	it("should throw an error for vectors with different lengths", () => {
		const vectorA = [1, 2, 3];
		const vectorB = [1, 2];
		expect(() => cosineSimilarity.compare(vectorA, vectorB)).toThrow(/same.*length/i);
	});

	it("should throw an error for zero vectors", () => {
		const vectorA = [0, 0, 0];
		const vectorB = [1, 2, 3];
		expect(() => cosineSimilarity.compare(vectorA, vectorB)).toThrow(/invalid input.*zero-magnitude vectors/i);
	});

	it("should return correct value for non-zero vectors", () => {
		const vectorA = [1, 0, 2];
		const vectorB = [2, 3, 4];
		const result = cosineSimilarity.compare(vectorA, vectorB);
		expect(result).toBeCloseTo(0.83045479, 5); // Based on manual calculation
	});
});
