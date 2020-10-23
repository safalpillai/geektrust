import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BaseHttpService } from './base-http.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptorService } from '@interceptors/app-http-interceptor.service';

describe('BaseHttpService', () => {
    let service: BaseHttpService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AppHttpInterceptorService,
                    multi: true
                }
            ]
        });
        service = TestBed.inject(BaseHttpService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
