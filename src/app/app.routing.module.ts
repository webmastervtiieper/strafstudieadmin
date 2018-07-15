import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';

/*import { MainComponent } from './shared/main/main.component';
import { LoginComponent } from './shared/app-pages/login/login.component';
import { NoconnectionComponent } from './shared/app-pages/noconnection/noconnection.component';
import { ErrorComponent } from './shared/app-pages/error/error.component';
import { StartComponent } from './shared/app-pages/start/start.component';
*/
import { GuardRouteAuth } from './core-module/guards/authenticated.guard';

import { MainComponent } from './core-module/components/main-component/main.component';
import { StartComponent } from './core-module/components/start-component/start.component';
// tslint:disable-next-line:max-line-length
import { StrafstudieaanvragenPageComponent } from './strafstudies-modules/components/strafstudieaanvragen/strafstudieaanvragen-page/strafstudieaanvragen-page.component';
// tslint:disable-next-line:max-line-length
import { StrafstudieaanvraagDetailPageComponent } from './strafstudies-modules/components/strafstudieaanvragen/strafstudieaanvraag-detail-page/strafstudieaanvraag-detail-page.component';
import { GuardDataReady } from './core-module/guards/dataready.guard';
// tslint:disable-next-line:max-line-length
import { StrafstudietypesPageComponent } from './strafstudies-modules/components/strafstudietypes/strafstudietypes-page/strafstudietypes-page.component';
import { ErrorPageComponent } from './core-module/components/error-page/error-page.component';

// import { NotFoundComponent } from 'app/shared/app-pages/not-found/not-found.component';

/*
export const ROUTE_NAMES = {
    strafstudieAanvragen:'strafstudieAanvragen',
    strafstudies:'strafstudies',
    strafstudieSessies:'strafstudieSessies'
}*/

export const STRAFSTUDIE_MODULE_ROUTES: Routes = [
  {
    path: 'strafstudieAanvragen',
    children: [
      // data:{mustRedirectToStart:true} => om aan te geven of de pagina naar start moet redirected
      // worden als de initiele data nog niet is geladen wordt in app.component gebruikt om de redirect toe te passen of niet.
      {
        path: '',
        component: StrafstudieaanvragenPageComponent,
        canActivate: [GuardRouteAuth, GuardDataReady],
        data: { mustRedirectToStart: true }
      },
      {
        path: ':aanvraagId',
        component: StrafstudieaanvraagDetailPageComponent,
        canActivate: [GuardRouteAuth],
        data: { mustRedirectToStart: true }
      }
      // { path: ':klantId/:cryptoPortfolioId', component: CryptoPortfolioWalletsPageComponent, canActivate: [GuardRouteAuth]}
    ]
  },
  {
    path: 'strafstudieTypes',
    children: [
      {
        path: '',
        component: StrafstudietypesPageComponent,
        canActivate: [GuardRouteAuth, GuardDataReady],
        data: { mustRedirectToStart: true }
      }
    ]
  }
];

export const APP_ROUTES: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: 'noconnection', component: NoconnectionComponent,},
  // { path: 'error', component: ErrorComponent },
  // { path: 'pagenotfound', component:NotFoundComponent},
  {
    path: '',
    component: MainComponent,
    data: { mustRedirectToStart: true },
    canActivate: [GuardRouteAuth],
    children: [
      {
        path: 'start',
        component: StartComponent,
        canActivate: [GuardRouteAuth]
      },
      ...STRAFSTUDIE_MODULE_ROUTES
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: '' }
  // index route
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
