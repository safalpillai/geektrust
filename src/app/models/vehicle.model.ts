import { IVehicle } from './core.model';

/**
 * Create vehicle instance
 */
export class Vehicle implements IVehicle {
    readonly name: string;
    readonly total_no: number;
    readonly max_distance: number;
    readonly speed: number;

    constructor(instance: IVehicle) {
        Object.assign(this, instance);
    }
}
