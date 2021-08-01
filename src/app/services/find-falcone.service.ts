import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { IPlanet, IVehicle } from '@models/core.model';
import { SearchCriteria } from '@models/search-criteria.model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FindFalconeService {
    private renderer: Renderer2;

    // For resetting the planets & vehicles state
    pristinePlanets: IPlanet[];
    pristineOptions: IVehicle[][];

    /** Object for find POST API  */
    searchCriteria: SearchCriteria;

    /** Planets array which holds selected planets */
    planets$ = new BehaviorSubject<IPlanet[]>([]);

    /** Dropdown options pool set for all 4 searches textboxes */
    options$ = new BehaviorSubject<IVehicle[][]>([]);

    /** Reset find falcone component */
    resetFindFalconeState$ = new Subject<void>();

    /** Total time taken subject */
    totalTimeTaken$ = new Subject<number>();

    /** Find falcone button status */
    isResponseValid$ = new Subject<boolean>();

    constructor(
        private rendererFactory: RendererFactory2,
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
    }

    /**
     * Set planet as selected in SearchCriteria.planet_names
     * @param index Index of insertion in SearchCriteria.planet_names
     * @param name Name of the planet
     */
    setPlanetAsSelected(index: number, name: string): void {
        this.searchCriteria.selectPlanet(index, name);

        // Show reset button
        /* tslint:disable */
        this.searchCriteria.hasPlanets()
            && this.renderer.removeClass(document.querySelector('#resetButton'), 'hide-reset');
    }

    /**
     * Set vehicle as selected in SearchCriteria.vehicle_names
     * @param index Index of insertion in SearchCriteria.vehicle_names
     * @param name Name of the vehicle
     */
    setVehicleAsSelected(index: number, name: string): void {
        this.searchCriteria.selectVehicle(index, name);

        // Toggle find falcone button
        this.isResponseValid$.next(this.searchCriteria.validateResponse());
    }

    /**
     * Set vehicle counts based on SearchCriteria.vehicle_names
     * @param index To check if value exists in this index (for incrementing previously selected vehicle count)
     */
    reviseVehicleCount(index: number, vehicleName: string): IVehicle[][] {
        const previousState = this.searchCriteria.getPreviousVehicleState();
        const alreadySelected = previousState[index];
        return this.options$.value.map((vehicleArray: IVehicle[]) => {
            const selectedVehicles = this.searchCriteria.getVehicles().filter(Boolean);
            vehicleArray.forEach((vehicle: IVehicle) => {
                if (
                    selectedVehicles.includes(vehicle.name)
                    && vehicleName === vehicle.name
                    && vehicle.total_no
                ) {
                    vehicle.total_no--;
                }

                // Increment previously selected vehicle's quantity
                if (alreadySelected && vehicle.name === alreadySelected) vehicle.total_no++;
            });
            return vehicleArray;
        });
    }

    /**
     * Set dropdown options to show in each search component
     * @param index To check if value exists in this index
     */
    reviseAllVehicleOptions(index: number, vehicleName: string): void {
        const optionsWithRevisedVehicleCount = this.reviseVehicleCount(index, vehicleName);
        this.options$.next(optionsWithRevisedVehicleCount);
    }
}
