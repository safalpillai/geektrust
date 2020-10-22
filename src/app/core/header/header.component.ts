import { Component, OnInit } from '@angular/core';
import { SearchCriteria } from '@models/search-criteria.model';
import { FindFalconeService } from '@services/find-falcone.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(
        private findFalconeService: FindFalconeService,
    ) { }

    ngOnInit(): void {
    }

    /**
     * Reset selected planets
     */
    resetPlanets() {
        this.findFalconeService.searchCriteria = new SearchCriteria(localStorage.getItem('apiToken'));
        this.findFalconeService.resetFindFalconeState$.next();
    }
}
