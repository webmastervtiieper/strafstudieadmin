import { Errorhandler } from './../services/utility-services/error-handler.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/base/authentication.service';
import { applicationError } from '../services/utility-services/error-handler.service';
import { APPCORE_SETTINGS } from '../../app.settings';


@Injectable()
export class GuardRouteAuth implements CanActivate {
  constructor(private authService: AuthenticationService) {}
  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      // controleer of de gebruiker is ingelogd; controleer serverside
      this.authService.checkLoginStatus()
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        resolve(false);
      });
    });
  }
}

export class GuardRoutePermission implements CanActivate {
    constructor(private authService: AuthenticationService) { }
    canActivate(): Promise<boolean> {
        return new Promise((resolve) => {
            this.authService.checkLoginStatus()
                .then(() => {
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
        });
    }
}
