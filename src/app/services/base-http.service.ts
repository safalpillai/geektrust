import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Wrappers for HTTP methods
 */
@Injectable({
    providedIn: 'root'
})
export class BaseHttpService {

    constructor(
        @Inject('BASE_URL') private readonly apiUrl: string,
        private readonly httpClient: HttpClient,
    ) {}

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
    post(endPoint: string, payload?: any, option = {}): Observable<any> {
        return this.httpClient.post(`${this.apiUrl}${endPoint}`, payload, option);
    }
}
