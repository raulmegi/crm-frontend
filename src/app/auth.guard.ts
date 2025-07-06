import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    UrlTree
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }


    async canActivate(): Promise<boolean | UrlTree> {
        const user = await this.authService.getLoggedUser();

        if (user) {
            return true;
        } else {
            return this.router.createUrlTree(['/login']);
        }
    }
}