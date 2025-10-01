import { appLogger } from "./config/log4js";
import process from "./process/process";
import TFIDFRegistry from './init/tfidf';
import CosineSimilarityComputeIO from './similarity/cosine-similarity/compute-io';
import { VectorBuilder } from './similarity/vector-builder';
import { isBlank } from './utils/string-utils';
import { PlagiarismArgs } from './interfaces/PipelineOutput';

function areBothDocumentsBlank(referenceDocument: string, queryDocument: string): boolean {
	return isBlank(referenceDocument) && isBlank(queryDocument);
}

function isSameDocument(referenceDocument: string, queryDocument: string): boolean {
	return !isBlank(referenceDocument) && referenceDocument === queryDocument;
}

function hasVectorOverlap(refVector: number[], queryVector: number[]): boolean {
	return refVector.some((v, i) => v > 0 && queryVector[i] > 0);
}

function isPlagiarism(referenceDocument: string, queryDocument: string, args: PlagiarismArgs = {}): boolean {
	// Short-circuit trivial cases on raw inputs
	if (areBothDocumentsBlank(referenceDocument, queryDocument)) {
		return false;
	}
	if (isSameDocument(referenceDocument, queryDocument)) {
		return true;
	}

	// Process
	const refProcessed = process(referenceDocument);
	const queryProcessed = process(queryDocument);

	// Extract TF-IDF
	const tfidf = TFIDFRegistry.get('natural');
	tfidf.addDocuments([refProcessed, queryProcessed]);
	const refDocTerms = tfidf.getTopTermsForDocument(0);
	const queryDocTerms = tfidf.getTopTermsForDocument(1);

	// Build aligned vectors for similarity comparison
	const vectorBuilder = new VectorBuilder();
	const { refVector, queryVector } = vectorBuilder.buildVectors(refDocTerms, queryDocTerms);

	// If there is no overlapping non-zero term between documents, treat as not plagiarized
	if (!hasVectorOverlap(refVector, queryVector)) {
		return false;
	}

	// Compare similarity
	const cosineSimilarity = new CosineSimilarityComputeIO();
	const similarity = cosineSimilarity.compare(refVector, queryVector);
	if (similarity === null) {
		throw new Error('Cosine similarity returned null for the provided vectors.');
	}

	/**
	 * Return isPlagiarism boolean
	 * 
	 * Threshold determines when two documents are considered plagiarized.
	 * Defaults to 0.25 but can be overridden via args: { threshold: number }
	 */
	const { threshold = 0.25 } = args;
	appLogger.info(`Cosine similarity: ${similarity} (threshold: ${threshold})`);
	return similarity >= threshold;
}

export default isPlagiarism;
