import TFIDFRegistry from '../registries/tfidf-registry';
import TFIDFNatural from '../tfidf-extraction/natural';
import TFIDFCustom from '../tfidf-extraction/custom';
import { InitRegistry } from '../interfaces/InitRegistry';

const init: InitRegistry = () => {
    const defaults = {
        'natural': () => new TFIDFNatural(),
        'custom': () => new TFIDFCustom(),
    };
    
    const registry = new TFIDFRegistry();
    
    // Set default implementations
    Object.entries(defaults).forEach(([key, factory]) => registry.add(key, factory));
    return registry;
}

export default init();
