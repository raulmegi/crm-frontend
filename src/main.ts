import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { FormsModule } from '@angular/forms';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(appRoutes),
        importProvidersFrom(FormsModule, HttpClientModule)
    ]
}).catch(err => console.error("Error al arrancar Angular:", err));