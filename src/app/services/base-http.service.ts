import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Planet, Spacecraft } from '@models/core.model';

/**
 * Wrappers for HTTP methods
 */
@Injectable({
    providedIn: 'root'
})
export class BaseHttpService {
    apiUrl: string;

    constructor(
        private httpClient: HttpClient,
    ) {
        this.apiUrl = environment.apiEndpoint;
    }

    /**
     * Default GET method
     * @param endPoint GET API end point
     */
    get<T>(endPoint: string): Observable<T> {
        return this.httpClient.get<T>(`${this.apiUrl}${endPoint}`);
    }

    /**
     * Default POST method
     * @param endPoint POST API end point
     * @param payload Payload requested by POST API
     * @param option HTTP POST options
     */
    post<T>(endPoint: string, payload?: any, option = {}): Observable<T> {
        return this.httpClient.post<T>(`${this.apiUrl}${endPoint}`, payload, option);
    }
}
