import { IPlanet, IVehicle } from './core.model';

/**
 * Search criteria for find API (POST)
 */
export class SearchCriteria {
    planet_names: string[];
    vehicle_names: string[];
    private previousVehicleState: string[];
    private previousPlanetState: string[];
    private readonly VEHICLES: IVehicle[] = JSON.parse(localStorage.getItem('vehicles'));
    private readonly PLANETS: IPlanet[] = JSON.parse(localStorage.getItem('planets'));
    totalTimeTaken = 0;

    constructor(readonly token: string) {
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
    selectPlanet(index: number, name: string) {
        this.setPreviousPlanetState(this.getPlanets().slice());
        this.planet_names[index] = name;
    }

    getPlanets(): string[] {
        return this.planet_names;
    }

    private setPreviousPlanetState(vehicleState: string[]) {
        this.previousPlanetState = vehicleState;
    }

    getPreviousPlanetState(): string[] {
        return this.previousPlanetState;
    }

    /**
     * 
     * @param index Index to insert newly selected vehicle
     * @param name Name of the vehicle
     */
    selectVehicle(index: number, name: string) {
        this.setPreviousVehicleState(this.getVehicles().slice());
        this.vehicle_names[index] = name;
        this.totalTimeTaken = this.calculateTotalTime();
    }

    getVehicles(): string[] {
        return this.vehicle_names;
    }

    private setPreviousVehicleState(vehicleState: string[]) {
        this.previousVehicleState = vehicleState;
    }

    getPreviousVehicleState(): string[] {
        return this.previousVehicleState;
    }

    /**
     * Validate response to toggle find falcone button
     */
    validateResponse(): boolean {
        return this.planet_names.concat(this.vehicle_names).every(value => !!value);
    }

    /**
     * To toggle reset button
     */
    hasPlanets(): boolean {
        return !!this.planet_names.length;
    }

    /**
     * Calculate total time taken based on chosen planets & vehicles
     */
    calculateTotalTime(): number {
        return this.vehicle_names.reduce((previous, current, index) => {
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
        const selectedVehicle = this.VEHICLES.filter(vehicle => vehicle.name === vehicleName)[0];
        const selectedPlanet = this.PLANETS.filter(planet => planet.name === this.planet_names[index])[0];
        return selectedPlanet.distance / selectedVehicle.speed;
    }
}