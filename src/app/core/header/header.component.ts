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
        public router: Router,
    ) { }

    ngOnInit(): void {
    }
}
