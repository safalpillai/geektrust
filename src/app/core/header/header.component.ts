import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SearchCriteria } from '@models/search-criteria.model';
import { FindFalconeService } from '@services/find-falcone.service';
import { filter, map } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(
        private findFalconeService: FindFalconeService,
        private router: Router,
        private renderer: Renderer2,
    ) { }

    ngOnInit(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(_ => {
            this.router.url !== 'find-falcone'
                && this.renderer.addClass(document.querySelector('#resetButton'), 'hide-reset');
        });
    }

    /**
     * Reset selected planets
     */
    resetPlanets() {
        this.findFalconeService.searchCriteria = new SearchCriteria(localStorage.getItem('apiToken'));
        this.findFalconeService.resetFindFalconeState$.next();
    }
}
