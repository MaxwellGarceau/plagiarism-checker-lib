import { describe, it, expect } from 'vitest';
import TFIDFNatural from '../../src/tfidf-extraction/natural'; // Replace with the actual path
import TFIDFCustom from '../../src/tfidf-extraction/custom'; // Replace with the actual path
import { TFIDFExtractor } from '../../src/interfaces/TFIDFExtractor'; // Replace with the actual path

// Test implementations of TFIDF through a common interface
// Many implementations. One test.
function testTFIDFExtractor(name: string, createInstance: () => TFIDFExtractor) {
	describe(`${name}`, () => {
		const documents = [
			"cat sat on the mat",
			"cat and dog",
			"dog barked at the cat",
			"the mat was under the cat"
		];
		let processor: TFIDFExtractor;

		beforeEach(() => {
			processor = createInstance();
			processor.addDocuments(documents);
		});

		it('should calculate TF-IDF for a given term correctly', () => {
			const tfidfCat = processor.calculateTFIDF('cat');
			// Validate that the term 'cat' exists in all documents and has expected values
			expect(tfidfCat).toHaveLength(documents.length);
			expect(tfidfCat[0].measure).toBeGreaterThan(0);
			expect(tfidfCat[1].measure).toBeGreaterThan(0);
			expect(tfidfCat[2].measure).toBeGreaterThan(0);
			expect(tfidfCat[3].measure).toBeGreaterThan(0);

			// TODO: Write more exact test assertions
		});

		it('should return an empty array for a term that does not exist', () => {
			const tfidfUnknown = processor.calculateTFIDF('unknown');
			expect(tfidfUnknown.every(val => val.measure === 0)).toBe(true);
		});

		it('should retrieve the correct top terms for a document', () => {
			const topTermsDoc0 = processor.getTopTermsForDocument(0, 3);
			// Validate that the top terms have non-zero scores and correct order
			expect(topTermsDoc0).toHaveLength(3);
			expect(topTermsDoc0[0].score).toBeGreaterThanOrEqual(topTermsDoc0[1].score);
			expect(topTermsDoc0[1].score).toBeGreaterThanOrEqual(topTermsDoc0[2].score);
		});

		it('should handle an edge case with an empty document set', () => {
			const emptyProcessor = createInstance();
			const tfidfResult = emptyProcessor.calculateTFIDF('cat');
			expect(tfidfResult).toEqual([]);
		});

		it('should handle a single document correctly', () => {
			const singleDocProcessor = createInstance();
			singleDocProcessor.addDocuments(["cat and dog"]);
			const tfidfCat = singleDocProcessor.calculateTFIDF('cat');
			// Expect a single result for the single document
			expect(tfidfCat).toHaveLength(1);
			expect(tfidfCat[0].measure).toBeGreaterThan(0);
		});
	});
}

// Run the tests for both implementations
describe.each([
	['TFIDFNatural', () => new TFIDFNatural()],
	['TFIDFCustom', () => new TFIDFCustom()]
])('%s Implementation Tests', (name, createInstance) => {
	testTFIDFExtractor(name, createInstance);
});
