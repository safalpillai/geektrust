/**
 * Environment type
 */
export type IEnvironment = {
    production: boolean;
    apiUrl: string;
    apiToken?: string;
};

/**
 * API token generated from GeekTrust
 */
export type IAppToken = {
    token: string;
};

/**
 * Planet details
 */
export type IPlanet = {
    name: string;
    distance: number;
    selected?: boolean;
};

/**
 * Spacecrafts details
 */
export type IVehicle = {
    name: string;
    total_no: number;
    max_distance: number;
    speed: number;
};

/**
 * Result API
 */
export type IResult = {
    status: 'success' | 'false';
    planet_name?: string;
    error?: string;
};

/**
 * Environment + config properties
 */
export type IConfig = IEnvironment & {
    [k: string]: any;
};
