/**
 * Interface for managing multiple instances of an implementation.
 */
export interface Registry {
	/**
	 * Add a new TFIDFExtractor instance to the registry.
	 * @param id A unique identifier for the instance
	 * @param implementation The concrete implementation
	 */
	add(id: string, implementation: Object): void;

	/**
	 * Retrieve a TFIDFExtractor instance from the registry.
	 * @param id The unique identifier of the instance
	 * @returns The concrete implementation
	 */
	get(id: string): Object;
}
