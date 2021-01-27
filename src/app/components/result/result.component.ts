import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
    isFound: boolean;
    planet: string;

    constructor(
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe(result => {
            this.isFound = result.has('planet');
            /* tslint:disable */
            this.isFound && (this.planet = result.get('planet'));
        });
    }
}
