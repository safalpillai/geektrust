import { Component, OnInit } from '@angular/core';
import { Planet, Spacecraft } from '@models/core.model';
import { BaseHttpService } from '@services/base-http.service';

@Component({
    selector: 'app-find-falcone',
    templateUrl: './find-falcone.component.html',
    styleUrls: ['./find-falcone.component.scss']
})
export class FindFalconeComponent implements OnInit {
    planets: Planet[];
    spacecrafts: Spacecraft[];

    constructor(
        private http: BaseHttpService,
    ) { }

    ngOnInit(): void {
        this.http.get<Planet[]>('planets')
            .subscribe(response => this.planets = response);
        this.http.get<Spacecraft[]>('vehicles')
            .subscribe(response => this.spacecrafts = response);
    }

}
