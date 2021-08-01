import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IPlanet, IVehicle } from '@models/core.model';
import { FindFalconeService } from '@services/find-falcone.service';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeWhile } from 'rxjs/operators';

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
    @Input() INDEX: number;
    private isComponentAlive = true;
    planets: IPlanet[];
    copyOfPlanets: IPlanet[];
    allOptions: IVehicle[][];
    formGroup: FormGroup;
    chosenPlanet: IPlanet = null;
    search = new FormControl('');
    searchOutput$ = new Subject<string>();
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
        this.findFalconeService.planets$
            .pipe(
                takeWhile(_ => this.isComponentAlive),
                debounceTime(100)
            )
            .subscribe((planets: IPlanet[]) => {
                this.planets = planets;
                this.copyOfPlanets = planets.slice();
            });

        // Emit search textbox changes using subject
        this.search.valueChanges.pipe(
            takeWhile(_ => this.isComponentAlive),
            debounceTime(600),
            filter(query => {
                if (!query) {
                    this.searchOutput$.next('');
                    return false;
                }
                return true;
            }),
            filter(query => query.length > 1),
        ).subscribe((value: string) => {
            this.searchOutput$.next(value);
        });

        // Search textbox subject subscription
        this.searchOutput$
            .pipe(
                takeWhile(_ => this.isComponentAlive),
            )
            .subscribe((query: string) => {
                const queryResults: IPlanet[] = this.copyOfPlanets
                    .filter((planet: IPlanet) => planet.name.toLowerCase().includes(query.toLowerCase()));
                queryResults.length
                    ? this.planets = queryResults
                    : this.planets = [];
            });

        // Subscribe to all options array
        this.findFalconeService.options$
            .pipe(
                takeWhile(_ => this.isComponentAlive),
            )
            .subscribe((allOptions: IVehicle[][]) => this.allOptions = allOptions);

        // Subscribe to planets reset state
        this.findFalconeService.resetFindFalconeState$
            .pipe(
                takeWhile(_ => this.isComponentAlive)
            )
            .subscribe(_ => {
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

    ngOnDestroy(): void {
        // Unsubscribe subscriptions to avoid possible memory leaks
        this.isComponentAlive = false;
    }

    /**
     * Debounced blur event to fire selectPlanet() before hiding dropdowns
     */
    debouncedBlur(): void {
        setTimeout(() => {
            this.isSearchFocused = false;
        }, 100);
    }

    /**
     * Planet selection event
     * @param selected Selected planet to be inserted in SearchCriteria.planet_names
     */
    selectPlanet(selected: IPlanet): void {
        this.chosenPlanet = selected;

        // Update SearchCriteria.planet_names
        this.findFalconeService.setPlanetAsSelected(this.INDEX, selected.name);

        // Update planets array with selections
        const updatedPlanets: IPlanet[] = this.copyOfPlanets
            .map((planet: IPlanet) => {
                /* tslint:disable */
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
    selectVehicle(selected: IVehicle): void {
        this.findFalconeService.setVehicleAsSelected(this.INDEX, selected.name);

        // Update time taken
        this.findFalconeService.totalTimeTaken$.next(this.findFalconeService.searchCriteria.totalTimeTaken);

        // Reset all options array
        this.findFalconeService.reviseAllVehicleOptions(this.INDEX, selected.name);
    }
}
