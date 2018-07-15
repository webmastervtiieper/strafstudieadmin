//import { JWT_SETTINGS } from './../../../app.settings';
// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';


import { Observable } from 'rxjs';
import { AuthenticationService, JWTHeaderOptions } from './authentication.service';

//om in http interceptor te gebruiken om het token mee te geven in de header van de calls
export const JWT_SETTINGS : JWTHeaderOptions = 
{
        headerName:'AuthorizationHeader'
        ,tokenGetter: ()=>{ return localStorage.getItem("access_token"); }//jwtTokenGetter
        ,authScheme:'Bearer'
}

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
//JWT_SETTINGS gebruiken omdat de "injectie" van de authentication service leidt tot "dependency injection CYCLE"
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      headers : request.headers.set(JWT_SETTINGS.headerName,`${JWT_SETTINGS.authScheme}:${JWT_SETTINGS.tokenGetter()}`)
    });
    return next.handle(request);
  }
}