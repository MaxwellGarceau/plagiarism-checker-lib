import { appLogger } from "./config/log4js";
import process from "./process/process";
import TFIDFRegistry from './init/tfidf';

// TODO: Set defaults for args and type args
// TODO: Make a registry following the pattern for TFIDF and import here
// TODO: Add logging comments for each step
// TODO: Tie all parts together
function isPlagiarism(referenceDocument: string, queryDocument: string, args: Object = {}): boolean {
	// Process
	const refProcessed = process(referenceDocument);
	const queryProcessed = process(referenceDocument);

	// Extract TF-IDF
	const tfidf = TFIDFRegistry.get('natural');
	// TODO: How am I going to add documents here and compare?

	// Compare similarity

	/**
	 * Return isPlagiarism boolean
	 * 
	 * TODO: If greater than 0.8 then pass as not plagiarism
	 * TOOD: Double check that 0.8 is a good breakpoint for this conditional check
	 */
	return false;
}

export default isPlagiarism;
