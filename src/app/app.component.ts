import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { IConfig, IAppToken } from '@models/core.model';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        @Inject('AppConfig') private readonly config: IConfig,
        private http: HttpClient,
    ) {
        // disable logging in production
        /* tslint:disable */
        environment.production && (console.log = function() { });
    }

    ngOnInit() {
        this.http.post<IAppToken>(`${this.config.apiUrl}/token`, {})
            .subscribe((response: IAppToken) => {
                this.config.apiToken = response.token;
            });
    }
}
