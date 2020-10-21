/**
 * Search criteria for find API (POST)
 */
export class SearchCriteria {
    private planet_names: string[];
    private vehicle_names: string[];
    private previousVehicleState: string[];
    private previousPlanetState: string[];

    constructor(private readonly token: string) {
        const placeholder: undefined[] = Array.from({ length: 4 });
        this.planet_names = placeholder.slice();
        this.vehicle_names = placeholder.slice();
        this.previousVehicleState = placeholder.slice();
        this.previousPlanetState = placeholder.slice();
    }

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

    selectVehicle(index: number, name: string) {
        this.setPreviousVehicleState(this.getVehicles().slice());
        this.vehicle_names[index] = name;
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

    validateResponse(): boolean {
        return this.planet_names.length == 4 && this.vehicle_names.length == 4;
    }
}