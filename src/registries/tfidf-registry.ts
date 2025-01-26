import { TFIDFExtractor } from '../interfaces/TFIDFExtractor';

/**
 * A registry for managing multiple instances of TFIDFExtractor.
 */
class TFIDFRegistry {
	private registry: Map<string, TFIDFExtractor>;

	constructor() {
		this.registry = new Map();
	}

	/**
	 * Add a new TFIDFExtractor instance to the registry.
	 * @param id A unique identifier for the instance
	 * @param extractor The TFIDFExtractor instance
	 */
	add(id: string, extractor: TFIDFExtractor): void {
		if (this.registry.has(id)) {
			throw new Error(`Extractor with ID "${id}" already exists.`);
		}
		this.registry.set(id, extractor);
	}

	/**
	 * Retrieve a TFIDFExtractor instance from the registry.
	 * @param id The unique identifier of the instance
	 * @returns The TFIDFExtractor instance
	 */
	get(id: string): TFIDFExtractor {
		const extractor = this.registry.get(id);
		if (!extractor) {
			throw new Error(`No extractor found with ID "${id}".`);
		}
		return extractor;
	}
}

export default TFIDFRegistry;
