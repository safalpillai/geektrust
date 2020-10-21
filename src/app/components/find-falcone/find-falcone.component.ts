import { Component, OnInit } from '@angular/core';
import { BaseHttpService } from '@services/base-http.service';
import { FindFalconeService } from '@services/find-falcone.service';

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

    ngOnInit(): void {}
}
