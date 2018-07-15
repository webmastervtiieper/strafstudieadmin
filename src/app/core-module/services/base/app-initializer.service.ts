import { Injectable } from '@angular/core';
import { BreezeUnitOfWorkRepository } from '../../base-classes/breeze-unit-of-work-repository';
import { AuthenticationService } from './authentication.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NavigationBuildingService } from '../../base-classes/navigation-building-service.service';
import { ProgressBarService } from '../../components/utility-components/progress-bar/progress-bar-service';

/**
 * INIT APP
 */

 @Injectable()
 export class AppInitializer {
   private _activatedRoute: ActivatedRoute;
   private _uowRepository: BreezeUnitOfWorkRepository;
  private _routeNameToLandTo: string;
/**
   * controleer if in debug mode
   */
  get debug() {
    return (
      ( window.location.host.toString().indexOf('localhost:4200') >= 0 )
    );
  }

   constructor(
    private progressBarService: ProgressBarService,
    private router: Router,
    private authService: AuthenticationService,
    private navigationBuildingService: NavigationBuildingService) {
      this.authService.isInDebugMode = this.debug;
    }


   public init(uowRepository: BreezeUnitOfWorkRepository,  activatedRoute: ActivatedRoute,
    // activated route moet komen van het app-page-component want activatedRoute is geen singleton
    // zo wordt in de initservice gebruik gemaakt van de juiste activedRouted, vb in _checkStartValidity
    routeNameToLandTo: string = 'start') {
      this._routeNameToLandTo = routeNameToLandTo;
      this.progressBarService.progressBarShowState = true;
      this._activatedRoute = activatedRoute;
      this._uowRepository = uowRepository;

      return this._initApp().then(() => {
        this.progressBarService.progressBarShowState = false;
        this._checkStartValidity();
        this.router.navigate([this._routeNameToLandTo]);

      });
  }

  private _initApp() {
    const appInitPromises = [];
   // this._initDataObservables();
  //  this._initAppSettingsObserver();

    // fouten worden afgevange in de betreffende services
    appInitPromises.push(
      this.authService.getUserDataFromServer(),
      this.navigationBuildingService.initAppSettings(),
      this._uowRepository.init()
    );
    return Promise.all(appInitPromises);
  }

    /**
   * controleer of er voor de route extra data is gedefinieerd { mustRedirectToStart: boolean }
   * indien de route data nodig heeft wordt naar de start pagina geredirect.
   * als in de root van de website ga naar start van de app
   **/
  private _checkStartValidity() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      , map(() => this._activatedRoute)
      , map((route: ActivatedRoute) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
      , filter((route: ActivatedRoute) => route.outlet === 'primary')
      , mergeMap(route => route.data)
    )
    .subscribe((route: { mustRedirectToStart: boolean }) => {
      if (route.mustRedirectToStart && !this._uowRepository.dataReady) {
        this.router.navigate([this._routeNameToLandTo]);
      }
    });
  }
}
