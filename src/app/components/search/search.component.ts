import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IPlanet, IVehicle } from '@models/core.model';
import { SearchCriteria } from '@models/search-criteria.model';
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
    @ViewChild('searchWrapper') searchWrapper: ElementRef;
    @Input() INDEX;
    planets: IPlanet[];
    copyOfPlanets: IPlanet[];
    allOptions: IVehicle[][];
    formGroup: FormGroup;
    chosenPlanet: IPlanet = null;
    search = new FormControl('');
    searchOutput$ = new Subject<string>();
    subsink = new SubSink();
    isSearchFocused = false;
    isOptionsShown = false;

    constructor(
        private findFalconeService: FindFalconeService,
        private formBuilder: FormBuilder,
        private renderer: Renderer2,
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
        this.subsink.sink = this.findFalconeService.options$
            .subscribe(allOptions => this.allOptions = allOptions);
        
        // Subscribe to planets reset state
        this.subsink.sink = this.findFalconeService.resetFindFalconeState$.subscribe(_ => {
            this.chosenPlanet = null;
            this.search.setValue('');
            this.isOptionsShown = false;
            this.renderer.removeClass(this.searchWrapper.nativeElement, 'done');

            // Hide reset button
            this.renderer.addClass(document.querySelector('#resetButton'), 'hide-reset');
            
            // Reset time
            this.findFalconeService.totalTimeTaken$.next(0);

            // Reset planets
            this.findFalconeService.planets$.next(
                JSON.parse(JSON.stringify(this.findFalconeService.pristinePlanets))
            );

            // Reset all options
            this.findFalconeService.options$.next(
                JSON.parse(JSON.stringify(this.findFalconeService.pristineOptions))
            );
        });
    }

    ngOnDestroy() {
        // Unsubscribe component subscriptions to avoid possible memory leaks
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
        this.chosenPlanet = selected;

        // Update SearchCriteria.planet_names
        this.findFalconeService.setPlanetAsSelected(this.INDEX, selected.name);

        // Update planets array with selections
        const updatedPlanets: IPlanet[] = this.copyOfPlanets
            .map(planet => {
                planet.name === selected.name && (planet.selected = true);
                return planet;
            });
        this.findFalconeService.planets$.next(updatedPlanets);

        // Set value of search textbox
        this.search.setValue(selected.name);

        // Show options section
        this.isOptionsShown = true;
        this.formGroup.reset();
    }

    /**
     * Vehicle selection event
     * @param selected Selected vehicle to be inserted in SearchCriteria.vehicle_names
     */
    selectVehicle(selected: IVehicle) {
        this.findFalconeService.setVehicleAsSelected(this.INDEX, selected.name);

        // Update time taken
        this.findFalconeService.totalTimeTaken$.next(this.findFalconeService.searchCriteria.totalTimeTaken);

        // Reset all options array
        this.findFalconeService.reviseAllVehicleOptions(this.INDEX, selected.name);
    }
}
