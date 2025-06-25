import { Routes } from '@angular/router';
import ConstRoutes from './shared/constants/const-routes';
import { TaskListComponent } from './components/task-list/task-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

// import { CustomerComponent } from './components/customer/customer.component';
import { BrandListComponent } from './components/brand-list/brand-list.component';
// import { ContactComponent } from './components/contact/contact.component';


export const appRoutes: Routes = [
  // Ruta raíz redirige al login
  { path: '', redirectTo: ConstRoutes.PATH_LOGIN, pathMatch: 'full' },

  // Rutas públicas
{ path: ConstRoutes.PATH_LOGIN, component: LoginComponent },
{ path: ConstRoutes.PATH_SIGNUP, component: SignupComponent },

  // Rutas protegidas
  { path: ConstRoutes.PATH_TASKS, component: TaskListComponent },

  { path: ConstRoutes.PATH_BRAND, component: BrandListComponent },

  { path: ConstRoutes.PATH_CUSTOMER, component: CustomerListComponent },


//   { path: ConstRoutes.PATH_CONTACT, component: ContactComponent },

  // Ruta comodín para cualquier ruta no encontrada
  { path: '**', redirectTo: ConstRoutes.PATH_LOGIN }
];
