import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
/*import { GuardRouteAuth } from '../guards/authenticated.guard';
import { GuardDataReady } from '../guards/dataready.guard';*/


export interface IServicesToProvide {
  [key: string]: { provide: any; deps?: any[]; useClass?: any, useValue?: any, useExisting?: any };
}

export const baseServices: IServicesToProvide = {
  'HttpClient': {
    provide: HttpClient,
    deps: []
   },
  'Router': {
    provide: Router,
    deps: []
  },
  'ActivatedRoute': {
    provide: ActivatedRoute,
    deps: []
  },
  'ActivatedRouteSnapshot': {
    provide: ActivatedRouteSnapshot,
    deps: []
  }
  /*,
  'GuardRouteAuth': {
   provide: GuardRouteAuth
  },
  'GuardDataReady': {
    provide: GuardDataReady
   }*/
};
