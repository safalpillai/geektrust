import { TestBed } from '@angular/core/testing';

import { FindFalconeService } from './find-falcone.service';

describe('FindFalconeService', () => {
    let service: FindFalconeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FindFalconeService);
    });
});
