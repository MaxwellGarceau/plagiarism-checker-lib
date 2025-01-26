import { Registry } from './Registry';

interface InitRegistry {
	/**
	 * Initializes defaults
	 * @returns void.
	 */
	(): Registry;
}

export { InitRegistry };
