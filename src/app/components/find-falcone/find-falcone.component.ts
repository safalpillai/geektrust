import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FindFalconeService } from '@services/find-falcone.service';
import { IPlanet, IVehicle, IResult, IConfig } from '@models/core.model';
import { Planet } from '@models/planet.model';
import { Vehicle } from '@models/vehicle.model';
import { SearchCriteria } from '@models/search-criteria.model';
import { forkJoin, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-find-falcone',
    templateUrl: './find-falcone.component.html',
    styleUrls: ['./find-falcone.component.scss']
})
export class FindFalconeComponent implements OnInit, OnDestroy {
    private isComponentAlive = true;
    totalTime = 0;
    isButtonShown = false;

    constructor(
        @Inject('AppConfig') private readonly config: IConfig,
        private http: HttpClient,
        private findFalconeService: FindFalconeService,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.renderComponent();

        // Subscribe to total time taken value
        this.findFalconeService.totalTimeTaken$
            .pipe(
                takeWhile(_ => this.isComponentAlive)
            )
            .subscribe((time: number) => this.totalTime = time);

        // Subscribe to find falcone button status
        this.findFalconeService.isResponseValid$
            .pipe(
                takeWhile(_ => this.isComponentAlive)
            )
            .subscribe((status: boolean) => this.isButtonShown = status);
    }

    ngOnDestroy(): void {
        // Unsubscribe component subscriptions to avoid possible memory leaks
        this.isComponentAlive = false;
    }

    /**
     * Initialize component with API values
     */
    renderComponent(): void {
        forkJoin(
            [
                this.http.get<IPlanet[]>(`${this.config.apiUrl}/planets`),
                this.http.get<IVehicle[]>(`${this.config.apiUrl}/vehicles`)
            ]
        ).subscribe((responses: [IPlanet[], IVehicle[]]) => {
            // Set planets
            localStorage.setItem('planets', JSON.stringify(responses[0]));
            const planets = responses[0].map((planet: IPlanet) => new Planet(planet));
            this.findFalconeService.pristinePlanets = JSON.parse(JSON.stringify(planets));
            this.findFalconeService.planets$.next(planets);

            // Set vehicles
            localStorage.setItem('vehicles', JSON.stringify(responses[1]));
            const optionsArray: IVehicle[][] = Array.from({ length: 4 }).map(_ => {
                return responses[1].map((vehicle: IVehicle) => new Vehicle(vehicle));
            });
            this.findFalconeService.pristineOptions = JSON.parse(JSON.stringify(optionsArray));
            this.findFalconeService.options$.next(optionsArray);

            this.findFalconeService.searchCriteria = new SearchCriteria();
        });
    }

    /**
     * Send response to API to check if falcone was found
     */
    sendResponse(): void {
        const { planet_names, vehicle_names } = this.findFalconeService.searchCriteria;
        this.http.post(`${this.config.apiUrl}/find`, {
            token: this.config.apiToken,
            planet_names,
            vehicle_names,
        }).subscribe((response: IResult) => {
            if (response.status === 'success') this.router.navigate(['/result', { planet: response.planet_name }]);
            else this.router.navigate(['/result']);
        });
    }


    /**
     * Reset state
     */
    resetState(): void {
        this.findFalconeService.searchCriteria = new SearchCriteria();
        this.findFalconeService.resetFindFalconeState$.next();
        this.isButtonShown = false;
    }
}
