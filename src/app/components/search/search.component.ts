import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IPlanet, IVehicle } from '@models/core.model';
import { FindFalconeService } from '@services/find-falcone.service';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { SubSink } from 'subsink';

/**
 * Reusable search component which encapsulates planet selection UI
 */
@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
    @Input() INDEX;
    planets: IPlanet[];
    copyOfPlanets: IPlanet[];
    allOptions: IVehicle[][];
    formGroup: FormGroup;
    searchOutput$ = new Subject<string>();
    search = new FormControl('');
    subsink = new SubSink();
    isSearchFocused = false;
    isSearchDone = false;

    constructor(
        private findFalconeService: FindFalconeService,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
        // Set options form group
        this.formGroup = this.formBuilder.group({
            vehicleRadio: ['']
        });
        // Subscribe to planets
        this.findFalconeService.planets$.subscribe(planets => {
            this.planets = planets;
            this.copyOfPlanets = planets.slice();
        });

        // Emit search textbox changes using subject
        this.subsink.sink = this.search.valueChanges.pipe(
            debounceTime(600),
            filter(query => {
                if (!query) {
                    this.searchOutput$.next('');
                    return false;
                }
                return true;
            }),
            filter(query => query.length > 1),
        ).subscribe(value => {
            this.searchOutput$.next(value);
        });

        // Search textbox subject subscription
        this.subsink.sink = this.searchOutput$.subscribe(query => {
            this.planets = query
                ? this.copyOfPlanets.filter(planet => planet.name.toLowerCase().includes(query.toLowerCase()))
                : this.copyOfPlanets;
        });

        // Subscribe to all options array
        this.subsink.sink = this.findFalconeService.options$.subscribe(allOptions => this.allOptions = allOptions);
    }

    ngOnDestroy() {
        this.subsink.unsubscribe();
    }

    /**
     * Debounced blur event to fire selectPlanet() before hiding dropdowns
     */
    debouncedBlur() {
        setTimeout(() => {
            this.isSearchFocused = false;
        }, 200);
    }

    /**
     * Planet selection event
     * @param selected Selected planet to be inserted in SearchCriteria.planet_names
     */
    selectPlanet(selected: IPlanet) {
        // Update planets array with selections
        const updatedPlanets: IPlanet[] = this.copyOfPlanets
            .map(planet => {
                planet.name === selected.name && (planet.selected = true);
                return planet;
            });
        setTimeout(() => {
            this.findFalconeService.planets$.next(updatedPlanets);
        });

        // Set value of search textbox
        this.search.setValue(selected.name);

        // Update SearchCriteria.planet_names
        this.findFalconeService.setPlanetAsSelected(this.INDEX, selected.name);

        // Show options section
        this.isSearchDone = true;
    }

    /**
     * Vehicle selection event
     * @param selected Selected vehicle to be inserted in SearchCriteria.vehicle_names
     */
    setVehicleAsSelected(selected: IVehicle) {
        console.log({selected});
        this.findFalconeService.setVehicleAsSelected(this.INDEX, selected.name);

        // Reset all options array
        this.findFalconeService.resetAllVehicleOptions(this.INDEX);
    }
}
