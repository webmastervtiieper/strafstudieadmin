import { Component,  OnInit, OnDestroy } from '@angular/core';
import {  takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, AuthenticationSatus } from './core-module/services/base/authentication.service';

import { ProgressBarService } from './core-module/components/utility-components/progress-bar/progress-bar-service';
import { AppBreezeUnitOfWorkRepository } from './app-unit-of-work-repository';
import { applicationError, Errorhandler } from './core-module/services/utility-services/error-handler.service';
import { AppInitializer } from './core-module/services/base/app-initializer.service';


// import {routerTransition} from ''

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  initializing = true;
//  loginStateSubscription: Subscription;
  // routes die geen authenticatie vereisen
  // routes = ['/activateAccount', '/pagenotfound'];

  constructor(
    private appInitializer: AppInitializer,
    private appUowRepository: AppBreezeUnitOfWorkRepository,
    private progressBarService: ProgressBarService,
    private activatedRoute: ActivatedRoute,
    // private navigationBuildingService: NavigationBuildingService,
    private errorHandler: Errorhandler
  ) {}

  ngOnInit() {
    this._initDataObservables();
    this.progressBarService.progressBarShowState = true;
    this.initializing = true;
    this.appInitializer.init(this.appUowRepository, this.activatedRoute, 'start')
    .then(() => {
      this.progressBarService.progressBarShowState = false;
      this.initializing = false;
    });

    /*this._initApp().then(() => {
      this.initializing = false;
      this.progressBarService.progressBarShowState = false;
      // this._checkStartValidity();
      // this.router.navigate(['start']);
    });*/
}
/*
  private _initApp() {
    const appInitPromises = [];

    this._initDataObservables();
  //  this._initAppSettingsObserver();

    appInitPromises.push(
      this.authService.checkLoginStatus(),
      this.navigationBuildingService.initAppSettings(),
      this.uowRepository.init()
    );
    return Promise.all(appInitPromises);
  }*/

  /**
   * haal de appsettings, indien de appsettings niet correct zijn gehaald,
   * dus als er geen appId werd meegegeven in de querystring in de url bij het aanroepen van de App
   * wordt naar de login pagina redirected.
   */
 /* private _initAppSettingsObserver() {

    this.navigationBuildingService.appRoutingSettingsInitialized
    .subscribe((ok) => {
      if (ok) {
        this._checkStartValidity();
        this._initData();
      }
    });
  }*/

  /**
   *
   */
  private _initDataObservables() {
    this.appUowRepository.dataStatusChanged
    .pipe(
        takeUntil(this.appUowRepository.dataStatusChanged)
      )
    .subscribe(
      dataInitStatus => {
         console.log('datainitstatus changed', dataInitStatus.status);
      //  this.dataLoaderStatus = dataInitStatus.status;
      },
      e => { this.errorHandler.handleApplicationError(applicationError.undefined, e); },
      () => { }
    );
}

  /**
   * controleer of er voor de route extra data is gedefinieerd { mustRedirectToStart: boolean }
   * indien de route data nodig heeft wordt naar de start pagina geredirect.
   * als in de root van de website ga naar start van de app
   **/
  /*private _checkStartValidity() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
      , map(() => this.activatedRoute)
      , map((route: ActivatedRoute) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
      , filter((route: ActivatedRoute) => route.outlet === 'primary')
      , mergeMap(route => route.data)
    )
    .subscribe((route: { mustRedirectToStart: boolean }) => {
      if (route.mustRedirectToStart && !this.uowRepository.dataReady) {
        this.router.navigate(['start']);
      }
    });
  }*/

  ngOnDestroy() {
 //   this.loginStateSubscription.remove(this.loginStateSubscription);
  }
}
