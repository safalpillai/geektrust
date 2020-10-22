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
 * Result API
 */
export interface IResult {
    status: 'success' | 'false';
    planet_name?: string;
    error?: string;
}