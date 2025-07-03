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
    importProvidersFrom(
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      NgChartsModule
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    SnackbarService,
  ]
}).then(appRef => {
  const snackbarService = appRef.injector.get(SnackbarService);

  // Override window.alert to use snackbar
  window.alert = (message: string) => {
    snackbarService.show(message);
  };

  // Optional: override window.confirm to use snackbar (simple example)
  window.confirm = (message?: string): boolean => {
    snackbarService.show(`Confirm: ${message ?? 'Are you sure?'} (Using default confirm for now)`);
    return confirm(message);
  };

}).catch(err => console.error("Error initializing Angular:", err));
