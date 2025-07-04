// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ContactComponent } from './components/contact/contact.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { BrandListComponent } from './components/brand-list/brand-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { HomePageComponent } from './components/layout/home-page/home-page.component';
import ConstRoutes from './shared/constants/const-routes';
import { AppUserManagerComponent } from './components/app-user-manager/app-user-manager.component';
import { TaskCalendarComponent } from './components/layout/task-calendar/task-calendar.component';


export const appRoutes: Routes = [
  // Ruta raíz redirige al login
  { path: '', redirectTo: ConstRoutes.PATH_LOGIN, pathMatch: 'full' },

  // Rutas públicas
  { path: ConstRoutes.PATH_LOGIN,  component: LoginComponent },
  { path: ConstRoutes.PATH_SIGNUP, component: SignupComponent },

  // Home (privada, tras login)
  { path: 'home', component: HomePageComponent },

  // Rutas protegidas
  { path: ConstRoutes.PATH_TASKS,    component: TaskListComponent },
  { path: ConstRoutes.PATH_BRAND,    component: BrandListComponent },
  { path: ConstRoutes.PATH_CUSTOMER, component: CustomerListComponent },
  { path: ConstRoutes.PATH_APPUSER,     component: AppUserManagerComponent },
  { path: ConstRoutes.PATH_CONTACT, component: ContactComponent },
  { path: ConstRoutes.PATH_CONTACT, component: ContactComponent },
  // Comodín para cualquier ruta no encontrada
  { path: '**', redirectTo: 'home' }
];
