import { Injectable } from '@angular/core';
import { IPlanet, IVehicle } from '@models/core.model';
import { Subject } from 'rxjs';
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

    constructor(private readonly token: string) {
        this.planet_names = Array.from({ length: 4 });
        this.vehicle_names = Array.from({ length: 4 });
    }

    selectPlanet(index: number, name: string) {
        this.planet_names[index] = name;
    }

    getPlanets(): string[] {
        return this.planet_names;
    }

    selectVehicle(index: number, name: string) {
        this.vehicle_names[index] = name;
    }

    getVehicles(): string[] {
        return this.vehicle_names;
    }
}

@Injectable({
    providedIn: 'root'
})
export class FindFalconeService {
    searchCriteria: SearchCriteria;
    planets$: Subject<IPlanet[]> = new Subject<IPlanet[]>();
    vehicles: IVehicle[];

    constructor(
        private http: BaseHttpService,
    ) {
        this.searchCriteria = new SearchCriteria(localStorage.getItem('apiToken'));
        // get planets
        this.http.get<IPlanet[]>('planets').subscribe(response => {
            this.planets$.next(response.map(planet => new Planet(planet)));
        });
        // get vehicles
        this.http.get<IVehicle[]>('vehicles').subscribe(response => {
            this.vehicles = response.map(vehicle => new Vehicle(vehicle))
        });
    }
}
