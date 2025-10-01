// TODO: Should we change the output to be an array of strings?
export interface PipelineOutput {
	(text: string): string; // Flexible parameters, return type must be a string
}

export interface ProcessingStep {
	(tokens: string[]): string[];
}

export interface Tokenize {
	(text: string): string[];
}

export interface PlagiarismArgs {
	threshold?: number;
}
