import { TestBed } from '@angular/core/testing';

import { AppHttpInterceptorService } from './app-http-interceptor.service';

describe('AppHttpInterceptorService', () => {
    let service: AppHttpInterceptorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppHttpInterceptorService);
    });
});
