import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

/**
 * App components
 */
import { AppComponent } from './app.component';
import { HeaderComponent } from '@core/header/header.component';
import { FooterComponent } from '@core/footer/footer.component';
import { StartComponent } from '@components/start/start.component';
import { FindFalconeComponent } from '@components/find-falcone/find-falcone.component';
import { ResultComponent } from '@components/result/result.component';
import { SearchComponent } from './components/search/search.component';

/**
 * App Configurations
 */
import { AppConfig } from './app.config';

/**
 * App interceptors
 */
import { AppHttpInterceptorService } from '@interceptors/app-http-interceptor.service';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        StartComponent,
        FindFalconeComponent,
        ResultComponent,
        SearchComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        AppRoutingModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppHttpInterceptorService,
            multi: true
        },
        {
          provide: 'AppConfig',
          useValue: AppConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
