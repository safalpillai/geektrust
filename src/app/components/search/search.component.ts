import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
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
    searchOutput$ = new Subject<string>();
    search = new FormControl('');
    subsink = new SubSink();
    planets: IPlanet[];
    copyOfPlanets: IPlanet[];
    searchFocused = false;
    searchDone = false;

    constructor(
        private findFalconeService: FindFalconeService,
    ) {}

    ngOnInit(): void {
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
    }

    ngOnDestroy() {
        this.subsink.unsubscribe();
    }

    /**
     * Debounced blur event to fire selectPlanet() before hiding dropdowns
     */
    debouncedBlur() {
        setTimeout(() => {
            this.searchFocused = false;
        }, 200);
    }
    
    selectPlanet(selected: IPlanet) {
        const updatedPlanets: IPlanet[] = this.copyOfPlanets
            .map(planet => {
                planet.name === selected.name && (planet.selected = true);
                return planet;
            });
        this.findFalconeService.planets$.next(updatedPlanets);
        this.search.setValue(selected.name);
        this.searchDone = true;
    }
}
