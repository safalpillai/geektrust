import { IPlanet, IVehicle } from './core.model';

/**
 * Search criteria for find API (POST)
 */
export class SearchCriteria {
    /** Selected planet names */
    planet_names: string[];

    /** Selected vehicle names */
    vehicle_names: string[];

    /** To check whether the vehicle state change is in the same index */
    private previousVehicleState: string[];

    /** To check whether the planets state change is in the same index */
    private previousPlanetState: string[];

    /** Get vehicles reference to calculate total time */
    private readonly VEHICLES: IVehicle[] = JSON.parse(localStorage.getItem('vehicles'));

    /** Get planets reference to calculate total time */
    private readonly PLANETS: IPlanet[] = JSON.parse(localStorage.getItem('planets'));

    totalTimeTaken = 0;

    constructor() {
        const placeholder: undefined[] = Array.from({ length: 4 });
        this.planet_names = placeholder.slice();
        this.vehicle_names = placeholder.slice();
        this.previousVehicleState = placeholder.slice();
        this.previousPlanetState = placeholder.slice();
    }

    /**
     * Planet helpers
     * @param index Index to insert newly selected planet
     * @param name Name of the planet
     */
    selectPlanet(index: number, name: string): void {
        this.setPreviousPlanetState(this.getPlanets().slice());
        this.planet_names[index] = name;
    }

    getPlanets = (): string[] => this.planet_names;

    private setPreviousPlanetState(vehicleState: string[]): void {
        this.previousPlanetState = vehicleState;
    }

    getPreviousPlanetState = (): string[] => this.previousPlanetState;

    /**
     * Vehicle helpers
     * @param index Index to insert newly selected vehicle
     * @param name Name of the vehicle
     */
    selectVehicle(index: number, name: string): void {
        this.setPreviousVehicleState(this.getVehicles().slice());
        this.vehicle_names[index] = name;
        this.totalTimeTaken = this.calculateTotalTime();
    }

    getVehicles = (): string[] => this.vehicle_names;

    private setPreviousVehicleState(vehicleState: string[]): void {
        this.previousVehicleState = vehicleState;
    }

    getPreviousVehicleState = (): string[] => this.previousVehicleState;

    /**
     * Validate response to toggle find falcone button
     */
    validateResponse = (): boolean => this.planet_names.concat(this.vehicle_names).every(value => !!value);

    /**
     * To toggle reset button
     */
    hasPlanets = (): boolean => !!this.planet_names.length;

    /**
     * Calculate total time taken based on chosen planets & vehicles
     */
    calculateTotalTime(): number {
        return this.vehicle_names.reduce((previous: number, current: string, index: number) => {
            /* tslint:disable */
            !!current && (previous += this.calculateTimeForVehicle(current, index));
            return previous;
        }, 0);
    }

    /**
     * Calculate time taken for a vehicle to reach associated planet
     * @param vehicleName Name of vehicle
     * @param index Index of associated planet in planet_names
     */
    calculateTimeForVehicle(vehicleName: string, index: number): number {
        const selectedVehicle = this.VEHICLES.filter((vehicle: IVehicle) => vehicle.name === vehicleName)[0];
        const selectedPlanet = this.PLANETS.filter((planet: IPlanet) => planet.name === this.planet_names[index])[0];
        return selectedPlanet.distance / selectedVehicle.speed;
    }
}
