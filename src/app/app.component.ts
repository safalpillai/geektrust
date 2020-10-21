import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseHttpService } from '@services/base-http.service';
import { IAppToken } from '@models/core.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private http: BaseHttpService,
    ) {
        // disable logging in production
        environment.production && (console.log = function () { });
    }

    ngOnInit() {
        this.http.post<IAppToken>('token').subscribe(response => {
            localStorage.removeItem('apiToken');
            localStorage.setItem('apiToken', response.token);
        });
    }
}
