import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FindFalconeComponent } from '@components/find-falcone/find-falcone.component';
import { ResultComponent } from '@components/result/result.component';
import { StartComponent } from '@components/start/start.component';

/**
 * Application routes
 */
const routes: Routes = [
    { path: '', redirectTo: 'start', pathMatch: 'full' },
    { path: 'start', component: StartComponent },
    { path: 'find-falcone', component: FindFalconeComponent },
    { path: 'result', component: ResultComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
