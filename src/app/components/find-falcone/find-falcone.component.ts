import { Component, OnInit } from '@angular/core';
import { FindFalconeService } from '@services/find-falcone.service';
import { BaseHttpService } from '@services/base-http.service';
import { IPlanet, IVehicle } from '@models/core.model';
import { Planet } from '@models/planet.model';
import { Vehicle } from '@models/vehicle.model';
import { SearchCriteria } from '@models/search-criteria.model';

@Component({
    selector: 'app-find-falcone',
    templateUrl: './find-falcone.component.html',
    styleUrls: ['./find-falcone.component.scss']
})
export class FindFalconeComponent implements OnInit {

    constructor(
        private http: BaseHttpService,
        private findFalconeService: FindFalconeService,
    ) { }

    ngOnInit(): void {
        this.findFalconeService.searchCriteria = new SearchCriteria(localStorage.getItem('apiToken'));
        // get planets
        this.http.get<IPlanet[]>('planets').subscribe(response => {
            this.findFalconeService.planets$.next(
                response.map(planet => new Planet(planet))
            );
        });
        // get vehicles
        this.http.get<IVehicle[]>('vehicles').subscribe(response => {
            const optionsArray: IVehicle[][] = Array.from({ length: 4 }).map(_ => {
                return response.map(vehicle => new Vehicle(vehicle));
            });
            this.findFalconeService.options$.next(optionsArray);
        });
    }
}
