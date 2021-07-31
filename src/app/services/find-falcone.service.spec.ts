import { TestBed } from '@angular/core/testing';
import { IPlanet, IVehicle } from '@models/core.model';
import { SearchCriteria } from '@models/search-criteria.model';
import { FindFalconeService } from './find-falcone.service';

describe('FindFalconeService', () => {
    let service: FindFalconeService;
    let VEHICLES: IVehicle[];
    let PLANETS: IPlanet[];

    beforeAll(() => {
        VEHICLES = [
            {
                name: 'starfighter',
                total_no: 1,
                max_distance: 100,
                speed: 10
            },
            {
                name: 'interceptor',
                total_no: 1,
                max_distance: 100,
                speed: 20
            },
            {
                name: 'himalayan',
                total_no: 1,
                max_distance: 50,
                speed: 5
            }
        ];
        PLANETS = [
            {
                name: 'mars',
                distance: 100,
            },
            {
                name: 'venus',
                distance: 200,
            },
            {
                name: 'pluto',
                distance: 400,
            }
        ];
    });
    beforeEach(() => {
        service = TestBed.inject(FindFalconeService);
        service.searchCriteria = new SearchCriteria();
        service.searchCriteria['planet_names'] = ['mars', 'venus', undefined, undefined];
        service.searchCriteria['vehicle_names'] = ['starfighter', 'interceptor', undefined, undefined];
        Object.defineProperty(service.searchCriteria, 'VEHICLES', { value: VEHICLES, writable: true });
        Object.defineProperty(service.searchCriteria, 'PLANETS', { value: PLANETS, writable: true });
    });

    it('should have planet names array with 4 empty slots', () => {
        expect(service.searchCriteria.planet_names.length).toBe(4);
    });

    it('should have vehicle names array with 4 empty slots', () => {
        expect(service.searchCriteria.vehicle_names.length).toBe(4);
    });

    it('should have renderer2 class member', () => {
        expect(service['renderer']).toBeTruthy();
    });
});
