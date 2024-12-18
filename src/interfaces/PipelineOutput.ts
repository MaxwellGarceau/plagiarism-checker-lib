// TODO: Should we change the output to be an array of strings?
export default interface PipelineOutput {
	(...args: any[]): string; // Flexible parameters, return type must be a string
  }
  