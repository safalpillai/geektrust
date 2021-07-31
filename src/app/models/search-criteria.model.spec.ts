import { IPlanet, IVehicle } from './core.model';
import { SearchCriteria } from './search-criteria.model';

describe('SearchCriteria', () => {
    let searchCriteria;
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
        searchCriteria = new SearchCriteria();
        searchCriteria['planet_names'] = ['mars', 'venus', undefined, undefined];
        searchCriteria['vehicle_names'] = ['starfighter', 'interceptor', undefined, undefined];
        searchCriteria['VEHICLES'] = VEHICLES;
        searchCriteria['PLANETS'] = PLANETS;
    });

    it('should have necessary properties on instantiation', () => {
        expect(searchCriteria.planet_names.length).toBe(4);
        expect(searchCriteria.vehicle_names.length).toBe(4);
        expect(searchCriteria['previousVehicleState'].length).toBe(4);
        expect(searchCriteria['previousPlanetState'].length).toBe(4);
        expect(searchCriteria.totalTimeTaken).toBe(0);
        expect(searchCriteria['VEHICLES']).toBeDefined();
        expect(searchCriteria['VEHICLES'].length).toBeGreaterThan(1);
        expect(searchCriteria['PLANETS']).toBeDefined();
        expect(searchCriteria['PLANETS'].length).toBeGreaterThan(1);
    });

    it('should have planet pluto', () => {
        searchCriteria.selectPlanet(2, 'pluto');
        expect(searchCriteria.planet_names[2]).toBe('pluto');
    });

    it('should have 2 planets, 2 undefined slots', () => {
        expect(searchCriteria.getPlanets().length).toBe(4);
    });

    it('calculateTimeForVehicle() should return 10', () => {
        expect(searchCriteria.calculateTimeForVehicle('starfighter', 0)).toBeTruthy(10);
    });

    it('calculateTotalTime() should return 10', () => {
        expect(searchCriteria.calculateTotalTime()).toBeTruthy(10);
    });

    it('hasPlanets() should return 2 planets', () => {
        expect(searchCriteria.hasPlanets()).toBeTruthy(2);
    });

    it('should have invalid response', () => {
        expect(searchCriteria.validateResponse()).toBeFalse();
    });

    it('should have 2 vehicles, 2 undefined slots', () => {
        expect(searchCriteria.getVehicles().length).toBe(4);
    });

    it('should have vehicle himalayan', () => {
        searchCriteria.selectPlanet(2, 'pluto');
        searchCriteria.selectVehicle(2, 'himalayan');
        expect(searchCriteria.vehicle_names[2]).toBe('himalayan');
    });
});
