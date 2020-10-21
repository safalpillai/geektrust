import { IVehicle } from './core.model';

/**
 * Create vehicle instance
 */
export class Vehicle implements IVehicle {
    name: string;
    total_no: number;
    max_distance: number;
    speed: number;

    constructor(instance: IVehicle) {
        Object.assign(this, instance);
    }
}