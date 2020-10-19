import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Default interceptor that handles all API requests & responses
 */
@Injectable({
    providedIn: 'root'
})
export class AppHttpInterceptorService implements HttpInterceptor {

    constructor() { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(this.handleAppError.bind(this))
        );
    }

    /**
     * Default error handler for all APIs
     * @param error Error object sent from API
     */
    handleAppError(error): ObservableInput<any> {
        // error?.error && this.toast.error(error?.error);
        return throwError(error);
    }
}
