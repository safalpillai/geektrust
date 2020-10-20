/**
 * API token generated from GeekTrust
 */
export type AppToken = {
    token: string;
}

/**
 * Planet details
 */
export type Planet = {
    name: string;
    distance: string;
}

/**
 * Information about all the available spacecrafts
 */
export type Spacecraft = {
    name: string;
    total_no: number;
    max_distance: number;
    speed: number;
}

/**
 * POST body of find API
 */
export type FindFalcone = {
    token: string;
    planet_names: string[];
    vehicle_names: string[];
}