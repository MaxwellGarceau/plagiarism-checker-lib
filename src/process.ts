import winkNLP, { Detail, ItemToken, Bow } from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const nlp = winkNLP(model);
const { its, as } = nlp;

// TODO: Replace with another library that supports lemmatization
function process(text: string): Bow | string[] | null {
	// Early return for empty text
	if (!text || text.trim().length === 0) {
		return null;
	}

	// Step 1: Tokenize the text
	const doc = nlp.readDoc(text);
	let tokens = doc.tokens();

	// Step 2: Remove stop words (common words like 'the', 'is', 'at', etc.)
	tokens = tokens.filter((token: ItemToken) => !token.out(its.stopWordFlag));

	// Step 3: Remove punctuation tokens
	tokens = tokens.filter(token => token.out(its.pos) !== 'PUNCT');

	// Step 4: Lemmatize tokens (convert words to their base form)
	// Example: 'running' -> 'run', 'better' -> 'good'
	// const lemmatizedTokens = tokens.each((token: ItemToken) => token.out(its.lemma));
	// const lemmatizedTokens = tokens.map((token: ItemToken) => token.out(its.lemma));

	// // Step 5: Join the processed tokens back into a string
	// // Filter out any empty strings that might have been created during processing
	// const processedText = lemmatizedTokens
	// 	.filter(token => token && token.trim().length > 0)
	// 	.join(' ');

	const processedText = tokens.out(its.value, as.bow);

	console.log(processedText);

	return processedText;
}

export default process;