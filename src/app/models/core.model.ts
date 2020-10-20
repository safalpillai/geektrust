/**
 * API token generated from GeekTrust
 */
export interface IAppToken {
    token: string;
}

/**
 * Planet details
 */
export interface IPlanet {
    name: string;
    distance: number;
    selected?: boolean;
}

/**
 * Spacecrafts details
 */
export interface IVehicle {
    name: string;
    total_no: number;
    max_distance: number;
    speed: number;
}

/**
 * POST body of find API
 */
export interface IFindFalcone {
    token: string;
    planet_names: string[];
    vehicle_names: string[];
}