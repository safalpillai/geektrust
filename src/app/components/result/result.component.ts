import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Component({
    selector: 'app-result',
    templateUrl: './result.component.html',
    styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
    isFound: boolean;
    planet: string;
    isComponentAlive = true;

    constructor(
        private activatedRoute: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.activatedRoute.paramMap
            .pipe(
                takeWhile(_ => this.isComponentAlive)
            )
            .subscribe(result => {
                this.isFound = result.has('planet');
                /* tslint:disable */
                this.isFound && (this.planet = result.get('planet'));
            });
    }

    ngOnDestroy() {
        // Unsubscribe subscriptions to avoid possible memory leaks
        this.isComponentAlive = false;
    }
}
