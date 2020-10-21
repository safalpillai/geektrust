import { Injectable } from '@angular/core';
import { IPlanet, IVehicle } from '@models/core.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseHttpService } from './base-http.service';

/**
 * Create planet instance
 */
export class Planet implements IPlanet {
    name: string;
    distance: number;

    constructor(instance: IPlanet) {
        Object.assign(this, instance);
    }
}

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

/**
 * Search criteria for find API (POST)
 */
export class SearchCriteria {
    private planet_names: string[];
    private vehicle_names: string[];
    private previousState: string[];

    constructor(private readonly token: string) {
        this.planet_names = Array.from({ length: 4 });
        this.vehicle_names = Array.from({ length: 4 });
        this.previousState = Array.from({ length: 4 });
    }

    selectPlanet(index: number, name: string) {
        this.planet_names[index] = name;
    }

    getPlanets(): string[] {
        return this.planet_names;
    }

    selectVehicle(index: number, name: string) {
        this.setPreviousState(this.getVehicles().slice());
        this.vehicle_names[index] = name;
    }

    getVehicles(): string[] {
        return this.vehicle_names;
    }

    private setPreviousState(state: string[]) {
        this.previousState = state;
    }

    getPreviousState(): string[] {
        return this.previousState;
    }
}

@Injectable({
    providedIn: 'root'
})
export class FindFalconeService {
    searchCriteria: SearchCriteria;
    planets$: Subject<IPlanet[]> = new Subject<IPlanet[]>();
    options$ = new BehaviorSubject<IVehicle[][]>([]);

    constructor(
        private http: BaseHttpService,
    ) {
        this.searchCriteria = new SearchCriteria(localStorage.getItem('apiToken'));
        // get planets
        this.http.get<IPlanet[]>('planets').subscribe(response => {
            this.planets$.next(
                response.map(planet => new Planet(planet))
            );
        });
        // get vehicles
        this.http.get<IVehicle[]>('vehicles').subscribe(response => {
            const optionsArray: IVehicle[][] = Array.from({ length: 4 }).map( _ => {
                return response.map(vehicle => new Vehicle(vehicle));
            });
            this.options$.next(optionsArray);
        });
    }

    /**
     * Set vehicle as selected in SearchCriteria.vehicle_names
     * @param index Index of insertion in SearchCriteria.vehicle_names
     * @param name Name of the vehicle
     */
    setVehicleAsSelected(index: number, name: string) {
        this.searchCriteria.selectVehicle(index, name);
    }

    /**
     * Set planet as selected in SearchCriteria.planet_names
     * @param index Index of insertion in SearchCriteria.planet_names
     * @param name Name of the planet
     */
    setPlanetAsSelected(index: number, name: string) {
        this.searchCriteria.selectPlanet(index, name);
    }

    /**
     * Set vehicle counts based on SearchCriteria.vehicle_names
     * @param index To check if value exists in this index (for incrementing previously selected vehicle count)
     */
    reviseVehicleCount(index: number): IVehicle[][] {
        const previousState = this.searchCriteria.getPreviousState();
        const incrementVehicle = previousState[index];
        return this.options$.value.map(vehicleArray => {
            const selectedVehicles = this.searchCriteria.getVehicles().filter(Boolean);
            vehicleArray.forEach(vehicle => {
                if (selectedVehicles.includes(vehicle.name) && vehicle.total_no) vehicle.total_no--;
                if (incrementVehicle && vehicle.name === incrementVehicle) vehicle.total_no++;
            });
            return vehicleArray;
        });
    }

    /**
     * Options to show in each search component
     * @param index To check if value exists in this index
     */
    resetAllVehicleOptions(index: number) {
        const optionsWithRevisedVehicleCount = this.reviseVehicleCount(index);
        this.options$.next(optionsWithRevisedVehicleCount);
    }
}
