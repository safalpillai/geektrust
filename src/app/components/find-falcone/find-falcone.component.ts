import { Component, OnDestroy, OnInit } from '@angular/core';
import { FindFalconeService } from '@services/find-falcone.service';
import { BaseHttpService } from '@services/base-http.service';
import { IPlanet, IVehicle } from '@models/core.model';
import { Planet } from '@models/planet.model';
import { Vehicle } from '@models/vehicle.model';
import { SearchCriteria } from '@models/search-criteria.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-find-falcone',
    templateUrl: './find-falcone.component.html',
    styleUrls: ['./find-falcone.component.scss']
})
export class FindFalconeComponent implements OnInit, OnDestroy {
    subscription = new Subscription();
    totalTime = 0;

    constructor(
        private http: BaseHttpService,
        private findFalconeService: FindFalconeService,
    ) { }

    ngOnInit(): void {
        this.findFalconeService.searchCriteria = new SearchCriteria(localStorage.getItem('apiToken'));
        this.renderComponent();

        // Subscribe to total time taken value
        this.findFalconeService.totalTimeTaken$.subscribe(time => this.totalTime = time);
    }

    ngOnDestroy() {
        // Unsubscribe component subscriptions to avoid possible memory leaks
        this.subscription.unsubscribe();
    }

    /**
     * Initialize component with API values
     */
    renderComponent() {
        // Get planets
        this.http.get<IPlanet[]>('planets').subscribe(response => {
            localStorage.setItem('planets', JSON.stringify(response));
            const planets = response.map(planet => new Planet(planet));
            this.findFalconeService.pristinePlanets = JSON.parse(JSON.stringify(planets));
            this.findFalconeService.planets$.next(planets);
        });

        // Get vehicles
        this.http.get<IVehicle[]>('vehicles').subscribe(response => {
            localStorage.setItem('vehicles', JSON.stringify(response));
            const optionsArray: IVehicle[][] = Array.from({ length: 4 }).map(_ => {
                return response.map(vehicle => new Vehicle(vehicle));
            });
            this.findFalconeService.pristineOptions = JSON.parse(JSON.stringify(optionsArray));
            this.findFalconeService.options$.next(optionsArray);
        });
    }
}
