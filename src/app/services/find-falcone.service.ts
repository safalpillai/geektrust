import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { IPlanet, IVehicle } from '@models/core.model';
import { SearchCriteria } from '@models/search-criteria.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseHttpService } from './base-http.service';

@Injectable({
    providedIn: 'root'
})
export class FindFalconeService {
    /** Object for find POST API  */
    searchCriteria: SearchCriteria;
    /** Planets array which holds selected planets */
    planets$ = new BehaviorSubject<IPlanet[]>([]);
    /** Options pool for all 4 searches */
    options$ = new BehaviorSubject<IVehicle[][]>([]);
    /** Reset find falcone component */
    resetFindFalconeState = new Subject<void>();
    private renderer2: Renderer2;
    // For resetting the state
    pristinePlanets: IPlanet[];
    pristineOptions: IVehicle[][];

    constructor(
        private http: BaseHttpService,
        private rendererFactory: RendererFactory2,
    ) {
        this.renderer2 = this.rendererFactory.createRenderer(null, null);
    }
    
    /**
     * Set planet as selected in SearchCriteria.planet_names
     * @param index Index of insertion in SearchCriteria.planet_names
     * @param name Name of the planet
     */
    setPlanetAsSelected(index: number, name: string) {
        this.searchCriteria.selectPlanet(index, name);

        // Toggle reset button
        const resetButton = document.querySelector('#resetButton') as HTMLElement;
        this.searchCriteria.hasPlanets()
            && this.renderer2.removeClass(resetButton, 'hide-reset');
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
     * Set vehicle counts based on SearchCriteria.vehicle_names
     * @param index To check if value exists in this index (for incrementing previously selected vehicle count)
     */
    reviseVehicleCount(index: number, vehicleName: string): IVehicle[][] {
        const previousState = this.searchCriteria.getPreviousVehicleState();
        const alreadySelected = previousState[index];
        return this.options$.value.map(vehicleArray => {
            const selectedVehicles = this.searchCriteria.getVehicles().filter(Boolean);
            vehicleArray.forEach(vehicle => {
                if (
                    selectedVehicles.includes(vehicle.name)
                    && vehicleName === vehicle.name
                    && vehicle.total_no
                ) vehicle.total_no--;
                if (alreadySelected && vehicle.name === alreadySelected) vehicle.total_no++;
            });
            return vehicleArray;
        });
    }

    /**
     * Options to show in each search component
     * @param index To check if value exists in this index
     */
    reviseAllVehicleOptions(index: number, vehicleName: string) {
        const optionsWithRevisedVehicleCount = this.reviseVehicleCount(index, vehicleName);
        this.options$.next(optionsWithRevisedVehicleCount);
    }
}
