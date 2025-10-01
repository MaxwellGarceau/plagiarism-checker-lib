import { appLogger } from "./config/log4js";
import process from "./process/process";
import TFIDFRegistry from './init/tfidf';
import CosineSimilarityComputeIO from './similarity/cosine-similarity/compute-io';

// TODO: Set defaults for args and type args
// TODO: Make a registry following the pattern for TFIDF and import here
// TODO: Add logging comments for each step
// TODO: Tie all parts together
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

	// Build aligned vectors across a unified vocabulary
	const vocabulary = Array.from(new Set([
		...refDocTerms.map(t => t.term),
		...queryDocTerms.map(t => t.term)
	])).sort();

	// Build vectors
	// Map terms to their TF-IDF scores
	const termToScoreRef = new Map<string, number>(refDocTerms.map(({ term, score }) => [term, score]));
	const termToScoreQuery = new Map<string, number>(queryDocTerms.map(({ term, score }) => [term, score]));

	const refVector = vocabulary.map(term => termToScoreRef.get(term) ?? 0);
	const queryVector = vocabulary.map(term => termToScoreQuery.get(term) ?? 0);

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
