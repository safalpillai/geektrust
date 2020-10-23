import { Component, OnDestroy, OnInit } from '@angular/core';
import { FindFalconeService } from '@services/find-falcone.service';
import { BaseHttpService } from '@services/base-http.service';
import { IPlanet, IVehicle, IResult } from '@models/core.model';
import { Planet } from '@models/planet.model';
import { Vehicle } from '@models/vehicle.model';
import { SearchCriteria } from '@models/search-criteria.model';
import { forkJoin, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-find-falcone',
    templateUrl: './find-falcone.component.html',
    styleUrls: ['./find-falcone.component.scss']
})
export class FindFalconeComponent implements OnInit, OnDestroy {
    subscription = new Subscription();
    totalTime = 0;
    isButtonShown = false;

    constructor(
        private http: BaseHttpService,
        private findFalconeService: FindFalconeService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.renderComponent();

        // Subscribe to total time taken value
        this.findFalconeService.totalTimeTaken$.subscribe(time => this.totalTime = time);

        // Subscribe to find falcone button status
        this.findFalconeService.isResponseValid$.subscribe(status => this.isButtonShown = status);
    }

    ngOnDestroy() {
        // Unsubscribe component subscriptions to avoid possible memory leaks
        this.subscription.unsubscribe();
    }

    /**
     * Initialize component with API values
     */
    renderComponent() {
        forkJoin(
            [
                this.http.get<IPlanet[]>('planets'),
                this.http.get<IVehicle[]>('vehicles')
            ]
        ).subscribe(responses => {
            // Set planets
            localStorage.setItem('planets', JSON.stringify(responses[0]));
            const planets = responses[0].map(planet => new Planet(planet));
            this.findFalconeService.pristinePlanets = JSON.parse(JSON.stringify(planets));
            this.findFalconeService.planets$.next(planets);

            // Set vehicles
            localStorage.setItem('vehicles', JSON.stringify(responses[1]));
            const optionsArray: IVehicle[][] = Array.from({ length: 4 }).map(_ => {
                return responses[1].map(vehicle => new Vehicle(vehicle));
            });
            this.findFalconeService.pristineOptions = JSON.parse(JSON.stringify(optionsArray));
            this.findFalconeService.options$.next(optionsArray);

            this.findFalconeService.searchCriteria = new SearchCriteria(localStorage.getItem('apiToken'));
        })
    }

    /**
     * Send response to API to check if falcone was found
     */
    sendResponse() {
        const { token, planet_names, vehicle_names } = this.findFalconeService.searchCriteria;
        this.http.post('find', { token, planet_names, vehicle_names }).subscribe((response: IResult) => {
            if (response.status === 'success') this.router.navigate(['/result', { planet: response.planet_name }]);
            else this.router.navigate(['/result']);
        });
    }


    /**
     * Reset state
     */
    resetState() {
        this.findFalconeService.searchCriteria = new SearchCriteria(localStorage.getItem('apiToken'));
        this.findFalconeService.resetFindFalconeState$.next();
        this.isButtonShown = false;
    }
}
