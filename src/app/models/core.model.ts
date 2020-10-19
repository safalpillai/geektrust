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