import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

/**
 * For invoking common HTTP methods throughout the app
 */
@Injectable({
    providedIn: 'root'
})
export class BaseHttpService {
    apiUrl: string;

    constructor(
        private http: HttpClient,
    ) {
        this.apiUrl = environment.apiEndpoint;
    }

    get(endPoint: string, option?: any): Observable<any> {
        return this.http.get(`${this.apiUrl}${endPoint}`, option);
    }

    post(endPoint: string, payload?: any, option = {}): Observable<any> {
        return this.http.post(`${this.apiUrl}${endPoint}`, payload, option);
    }
}
