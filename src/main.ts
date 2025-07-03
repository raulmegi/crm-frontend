import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { NgChartsModule } from 'ng2-charts';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/auth.interceptor';
import { SnackbarService } from './services/snackbar.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(FormsModule, HttpClientModule, BrowserAnimationsModule, NgChartsModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    SnackbarService,  // provide SnackbarService here if needed
  ]
}).then(appRef => {
  // The injector for standalone bootstrap is the appRef.injector
  const snackbarService = appRef.injector.get(SnackbarService);

  window.alert = (message: string) => {
    snackbarService.show(message);
  };

}).catch(err => console.error("Error al arrancar Angular:", err));
