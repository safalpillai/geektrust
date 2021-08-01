import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Default interceptor that handles all API requests & responses
 */
@Injectable({
    providedIn: 'root'
})
export class AppHttpInterceptorService implements HttpInterceptor {

    constructor(
        private router: Router,
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        let headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        const authorizedRequest = req.clone({ headers });
        return next.handle(authorizedRequest).pipe(
            catchError(this.handleAppError)
        );
    }

    /**
     * Default API error handler for all API calls
     * @param error Error object sent from API
     */
    handleAppError(error: any): ObservableInput<any> {
        // Error shown without any toast service
        if (error?.error) {
            alert(`Error shown without any toast service - ${JSON.stringify(error.error, null, 3)}`);
            this.router.navigate(['/start']);
        }
        return throwError(error);
    }
}
