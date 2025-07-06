import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ContactComponent } from './components/contact/contact.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { BrandListComponent } from './components/brand-list/brand-list.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { HomePageComponent } from './components/layout/home-page/home-page.component';
import { AppUserManagerComponent } from './components/app-user-manager/app-user-manager.component';
import { TaskCalendarComponent } from './components/layout/task-calendar/task-calendar.component';
import { AuthGuard } from './auth.guard';
import ConstRoutes from './shared/constants/const-routes';

export const appRoutes: Routes = [
  { path: '', redirectTo: ConstRoutes.PATH_LOGIN, pathMatch: 'full' },
  { path: ConstRoutes.PATH_LOGIN, component: LoginComponent },
  { path: ConstRoutes.PATH_SIGNUP, component: SignupComponent },
  { path: 'registro', component: SignupComponent },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'home', component: HomePageComponent },
      { path: ConstRoutes.PATH_TASKS, component: TaskListComponent },
      { path: ConstRoutes.PATH_BRAND, component: BrandListComponent },
      { path: ConstRoutes.PATH_CUSTOMER, component: CustomerListComponent },
      { path: ConstRoutes.PATH_APPUSER, component: AppUserManagerComponent },
      { path: ConstRoutes.PATH_CONTACT, component: ContactComponent },
      { path: '**', redirectTo: 'home' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
