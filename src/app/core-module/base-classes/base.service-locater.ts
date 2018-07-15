import { HttpClient } from '@angular/common/http';

import { Injector } from '@angular/core';
import { IServicesToProvide } from './base.service';

export  class BaseServiceLocator {
  static injector: Injector;
  static buildInjector(servicesToProvide: IServicesToProvide) {
    BaseServiceLocator.injector = Injector.create(
      Object.keys(servicesToProvide).map(key => ({
        provide: servicesToProvide[key].provide,
        useClass: servicesToProvide[key].provide,
        deps: servicesToProvide[key].deps
      }))
    );
    return BaseServiceLocator.injector;
  }

  constructor() {}
}
/*
export class AppServiceLocator {
 static injector: Injector;
 constructor() {
  AppServiceLocator.injector = BaseServiceLocator.buildInjector();
 }
}*/
