import { Planet } from './planet.model';

describe('Planet', () => {
    it('should create an instance', () => {
        expect(new Planet({
            name: 'Paris',
            distance: 200
        })).toBeTruthy();
    });
});
