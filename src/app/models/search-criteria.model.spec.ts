import { SearchCriteria } from './search-criteria.model';

describe('SearchCriteria', () => {
    const searchCriteria = new SearchCriteria('randomapitoken');

    beforeEach(() => {
        const VEHICLES = [
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

        const PLANETS = [
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

        searchCriteria['planet_names'] = ['mars', 'venus', undefined, undefined];
        searchCriteria['vehicle_names'] = ['starfighter', 'interceptor', undefined, undefined];
        Object.defineProperty(searchCriteria, 'VEHICLES', { value: VEHICLES, writable: true });
        Object.defineProperty(searchCriteria, 'PLANETS', { value: PLANETS, writable: true });
    });

    it('should have planet', () => {
        searchCriteria.selectPlanet(2, 'pluto');
        expect(searchCriteria.planet_names[2]).toBe('pluto');
    });

    it('should have 2 planets, 2 undefined slots', () => {
        expect(searchCriteria.getPlanets().length).toBe(4);
    });
    
    it('should have api token during initialization', () => {
        expect(searchCriteria.token).toBeTruthy();
    });
    
    it('should have time taken for a vehicle to be 10', () => {
        expect(searchCriteria.calculateTimeForVehicle('starfighter', 0)).toBeTruthy(10);
    });

    it('should have total time taken to be 20', () => {
        expect(searchCriteria.calculateTotalTime()).toBeTruthy(10);
    });

    it('should have 2 planets', () => {
        expect(searchCriteria.hasPlanets()).toBeTruthy(10);
    });

    it('should have invalid response', () => {
        expect(searchCriteria.validateResponse()).toBeFalse();
    });

    it('should have 2 vehicles, 2 undefined slots', () => {
        expect(searchCriteria.getVehicles().length).toBe(4);
    });

    it('should have vehicle himalayan', () => {
        searchCriteria.selectPlanet(2, 'pluto')
        searchCriteria.selectVehicle(2, 'himalayan');
        expect(searchCriteria.vehicle_names[2]).toBe('himalayan');
    });
});
