import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Injector } from '@angular/core';
import { Errorhandler } from '../services/utility-services/error-handler.service';

/**
 * BASE CLASS met veel gebruikte services;
 * op die manier moeten de services niet elke keer worden geinjecteerd
 */
export abstract class BaseWithServices {
  private _httpClient: HttpClient;
  private _router: Router;
  private _activatedRoute: ActivatedRoute;

  private _errorHandler: Errorhandler;

  public get httpClient() { return this._httpClient; }
  public get router() { return this._router; }
  public get activatedRoute() { return this._activatedRoute; }

  public get errorHandler() { return this._errorHandler; }


  constructor(protected injector: Injector) {

    this._httpClient = this.injector.get(HttpClient);
    this._router = this.injector.get(Router);
    this._activatedRoute  = this.injector.get(ActivatedRoute);

    this._errorHandler  = this.injector.get(Errorhandler);

  }
}
