
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AppBreezeUnitOfWorkRepository } from '../../app-unit-of-work-repository';


@Injectable()
export class GuardDataReady implements CanActivate {
    constructor(private router: Router, private _uowRepo: AppBreezeUnitOfWorkRepository) {
    }

    canActivate() {
      // controleer of alle breeze data is geladen
      if (this._uowRepo.dataReady) { return true; }
      this.router.navigate(['/start']);
      return false;
    }
}
