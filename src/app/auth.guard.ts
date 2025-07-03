import { Injectable } from '@angular/core';
import {
CanActivate,
Router,
UrlTree
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
providedIn: 'root'
})
export class AuthGuard implements CanActivate {

constructor(
private http: HttpClient,
private router: Router
) {}

canActivate(): Observable<boolean | UrlTree> {
return this.http.get('/appUser/validate-session', {
withCredentials: true
}).pipe(
map(() => true), // Session is valid
catchError(() => {
// Redirect to login page if session invalid
return of(this.router.createUrlTree(['/login']));
})
);
}
}