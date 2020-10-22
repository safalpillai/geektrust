import { IPlanet } from './core.model';

/**
 * Create planet instance
 */
export class Planet implements IPlanet {
    name: string;
    distance: number;

    constructor(instance: IPlanet) {
        Object.assign(this, instance);
    }
}
