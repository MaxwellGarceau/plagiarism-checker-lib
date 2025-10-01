import { appLogger } from "./config/log4js";
import process from "./process/process";
import TFIDFRegistry from './init/tfidf';
import CosineSimilarityComputeIO from './similarity/cosine-similarity/compute-io';
import { VectorBuilder } from './similarity/vector-builder';

type PlagiarismArgs = { threshold?: number };

function isPlagiarism(referenceDocument: string, queryDocument: string, args: PlagiarismArgs = {}): boolean {
	// Process
	const refProcessed = process(referenceDocument);
	const queryProcessed = process(queryDocument);

	// Extract TF-IDF
	const tfidf = TFIDFRegistry.get('natural');
	// TODO: How am I going to add documents here and compare?
	tfidf.addDocuments([refProcessed, queryProcessed]);
	const refDocTerms = tfidf.getTopTermsForDocument(0);
	const queryDocTerms = tfidf.getTopTermsForDocument(1);

	// Build aligned vectors for similarity comparison
	const vectorBuilder = new VectorBuilder();
	const { refVector, queryVector } = vectorBuilder.buildVectors(refDocTerms, queryDocTerms);

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
	 * Defaults to 0.8 but can be overridden via args: { threshold: number }
	 */
	const { threshold = 0.8 } = args;
	appLogger.info(`Cosine similarity: ${similarity} (threshold: ${threshold})`);
	return similarity >= threshold;
}

export default isPlagiarism;
