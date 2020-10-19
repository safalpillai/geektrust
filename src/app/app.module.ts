import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/**
 * App components
 */
import { HeaderComponent } from '@core/header/header.component';
import { FooterComponent } from '@core/footer/footer.component';
import { StartComponent } from '@components/start/start.component';
import { FindFalconeComponent } from '@components/find-falcone/find-falcone.component';
import { ResultComponent } from '@components/result/result.component';

/**
 * App interceptors
 */
import { AppHttpInterceptorService } from '@interceptors/app-http-interceptor.service';

/**
 * ngx-toastr for handling user notifications
 */
import { ToastrModule } from 'ngx-toastr';
import { GlobalToastConfig } from '@config/toast.config';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        StartComponent,
        FindFalconeComponent,
        ResultComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ToastrModule.forRoot(GlobalToastConfig),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppHttpInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
