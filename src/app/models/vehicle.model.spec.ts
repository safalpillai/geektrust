import { IVehicle } from './core.model';
import { Vehicle } from './vehicle.model';


describe('Vehicle', () => {
    it('should return vehicle object', () => {
        const vehicleDetails: IVehicle = {
            max_distance: 100,
            name: 'voyager one',
            speed: 500,
            total_no: 1
        };
        const vehicle = new Vehicle(vehicleDetails);
        expect(vehicle.max_distance).toBeDefined();
        expect(vehicle.name).toBeDefined();
        expect(vehicle.speed).toBeDefined();
        expect(vehicle.total_no).toBeDefined();
    });
});
