
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  IRouteMenuItem } from './typings/menuItems';

import { Subject } from 'rxjs/Subject';
import { TOOLKITAPI_SETTINGS, APPCORE_SETTINGS } from '../../app.settings';
import { Errorhandler } from '../services/utility-services/error-handler.service';

/**
 * Contstante met de menu defs voor het hoofdmenu, bevat niet de 'route componenten' wel de routenamen.
 * De eigenlijke routedefinitie wordt in 'app.routing.module.ts' gedefinieerd,
 * samen met de 'MAIN_MENU_ITEMS' bepaalt dit de routing en menu opstelling
 * De eigenlijke routedefinitie wordt vas
 *
 * moeten in principe van de server komen volgens de welke gebruiker die is aangelogd
 * dus dit is een tussenstap
 */

@Injectable()
export class NavigationBuildingService {
  /// REGION: PRIVATES

  /// SUMMARY
  // _appId: Guid die in de backend, database wordt opgeslagen.
  // De appId wordt opgegeven in de applicatie settings
  // Deze wordt uitgelezen in opgeslagen gedurende app sessie in de navigation service.
  // doorheen de app wordt deze dan gebruikt om de gebruikersrechten te controleren
  /// END SUMMARY
  private _appId: string;

  private _routeMenus: IRouteMenuItem[];


  /// END REGION: PRIVATES
  private _appRoutingSettingsInitialized = new Subject<IRouteMenuItem[]>();
  private _appRouteMenusFetched = new Subject();
  /// REGION EXPOSED PROPERTIES
  /**
   * menu items voor de navigatie
   */
  get appRouteMenuItems() { return this._routeMenus; }

  get appId(): string { return this._appId; }
  set appId(v: string) { this._appId = v; }

  /**
   * Subscribe to me and afterwarts call initAppSettings to fetch te results
   */
  get appRoutingSettingsInitialized() { return this._appRoutingSettingsInitialized; }
  // get appRouteMenusFetched() { return this._appRouteMenusFetched; }
  // get menuActionsForRoute() {return }

  /// END REGION EXPOSED PROPERTIES

  constructor(
    private httpClient: HttpClient,
    private errorHandler: Errorhandler
  ) {}

  /**
   * Bepaal de appId uit de querystring de url waarmee de app werd opgeroepen
   * Haal de menu settings van de server voor deze applicatie adhv de APP_ID die in de url wordt meegegeven
   */
  public initAppSettings() {
    return new Promise<void>((resolve, reject) => {
      this._fetchAppRoutes()
      .subscribe(() => {
        this._appRoutingSettingsInitialized.next(this._routeMenus);
        this._appRoutingSettingsInitialized.complete();
        resolve();
      },
      (err: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(err).subscribe(() => {
        this._appRoutingSettingsInitialized.next([]);
      });
      reject();
    });
  });
}

  /**
   * De routes zijn vast in de applicatie ingebouwd, maar de hoofdMenu keuzes NIET
   * Haal de toegankelijke menukeuzes, die de links bevatten naar de routes die vast in het programma zitten.
   * De gebruikersgegevens worden meegegeven in de header van de api call onder de vorm van een bearer token
   */
  private _fetchAppRoutes() {
    const s  = new Subject();
    const url = TOOLKITAPI_SETTINGS.host + TOOLKITAPI_SETTINGS.routes.toolkitRoutes.appsApi + 'routesForApp';
    // controleer of is ingelogd vooraleer de applicatie routes te halen
    // interne id van de app; nodig om de menukeuzes in de app op tehalen.
      this.httpClient.get(url, {params: { appId: APPCORE_SETTINGS.appId }})
      .subscribe(
        (routeMenus: IRouteMenuItem[]) => {
        this._routeMenus = routeMenus;
        s.next();
      },
      (err: HttpErrorResponse) => {
        this.errorHandler.handleHttpError(err);
      });
    return s;
  }
}

