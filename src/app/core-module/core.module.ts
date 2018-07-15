import { AppInitializer } from './services/base/app-initializer.service';

import { TokenInterceptor } from './services/base/access-token.interceptor';
import { CommonModule } from '@angular/common';
import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
  ErrorHandler
} from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatDialogModule,
  MatCheckboxModule,
  MatIconModule,
  MatCardModule,
  MatSnackBarModule,
  MatInputModule,
  MatDatepickerModule,
  MatSelectModule,
  MatNativeDateModule,
  MatListModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTabsModule,
  MatSidenavModule,
  MatMenuModule
} from '@angular/material';
import {
  CovalentLayoutModule,
  CovalentDataTableModule,
  CovalentDialogsModule,
  CovalentExpansionPanelModule,
  CovalentSearchModule,
  CovalentMenuModule,
  CovalentMessageModule,
  CovalentPagingModule,
  CovalentLoadingModule
} from '@covalent/core';


import {ToastrModule} from 'ngx-toastr';


import { BreezeBridgeHttpClientModule } from 'breeze-bridge2-angular';

import {
  AuthenticationService,
  AuthenticationServiceSettings
} from './services/base/authentication.service';

import { GuardRouteAuth } from './guards/authenticated.guard';
import { GuardDataReady } from './guards/dataready.guard';
// import { GuardPendingChanges } from './services/guard.pendingChanges';

import {
  AUTHENTICATIONSERVICE_SETTINGS,
  APPCORE_SETTINGS
} from '../app.settings';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {
  BreezeManagerSettings,
  BreezeManager
} from './base-classes/breeze-manager';


import { MainComponent } from './components/main-component/main.component';
import { StartComponent } from './components/start-component/start.component';

// tslint:disable-next-line:max-line-length
import { PageTemplateTdNavLayoutComponent } from './components/utility-components/page-templates/page-template-td-nav-layout/page-template-td-nav-layout.component';
import { MatDialogEditorComponent } from './components/utility-components/mat-dialogs/mat-dialog-editor/mat-dialog-editor.component';
import { ProgressBarComponent } from './components/utility-components/progress-bar/progress-bar.component';
import { SideFloatOverComponent } from './components/utility-components/side-float-over/side-float-over.component';
import { StatusVizualizerComponent } from './components/utility-components/status-visualizer/status-visualizer.component';

// import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';
// import { APPCORE_SETTINGS, AUTHENTICATION_SETTINGS } from './../app.settings';
// import { Auth0Settings, Auth0AuthenticationService, AuthenticationService } from './services/authentication.service';

// import { securedHttpServiceFactory } from 'app/core/services/authHttp.service';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ErrorPageComponent } from './components/error-page/error-page.component';
import { BaseServiceLocator } from './base-classes/base.service-locater';

import { Utilities } from './services/utility-services/utilities';
import { NavigationBuildingService } from './base-classes/navigation-building-service.service';
import { TdSimpleDialogServices } from './services/utility-services/td-dialog-services';
import { ClipboardService } from './services/utility-services/clipboard-service';
import { ProgressBarService } from './components/utility-components/progress-bar/progress-bar-service';
import { Errorhandler } from './services/utility-services/error-handler.service';

import { baseServices } from './base-classes/base.service';



export class CoreConfigSettings {
  appId?: string;
  toLoginIfTokenExpired?: boolean;
  firmaNaam?: string;
  // auth0ServiceSettings: Auth0Settings;
  // connectionWebApiRoute: string;
  // mailApiRoute?: string;
  // language?: string;
  // fotoManagerApiRoute?: string;
  // userManagerApiRoute?: string;
}

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BreezeBridgeHttpClientModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    CommonModule,
    FlexLayoutModule,

    CovalentLayoutModule,
    CovalentDataTableModule,
    CovalentDialogsModule,
    CovalentExpansionPanelModule,
    CovalentSearchModule,
    CovalentMenuModule,
    CovalentMessageModule,
    CovalentPagingModule,
    CovalentLoadingModule,


    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTabsModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatMenuModule,
    // ng2-toastr
    ToastrModule.forRoot()
  ],

  declarations: [
    MainComponent,
    StartComponent,
    MatDialogEditorComponent,
    PageTemplateTdNavLayoutComponent,
    ProgressBarComponent,
    SideFloatOverComponent,
    StatusVizualizerComponent,
    ErrorPageComponent
  ],
  entryComponents: [PageTemplateTdNavLayoutComponent],

  exports: [
    RouterModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    FlexLayoutModule,
    // covalent modules
    CovalentLayoutModule,
    CovalentDataTableModule,
    CovalentDialogsModule,
    CovalentExpansionPanelModule,
    CovalentSearchModule,
    CovalentMenuModule,
    CovalentMessageModule,
    CovalentPagingModule,
    CovalentLoadingModule,
    // material design modules
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTabsModule,
    MatSidenavModule,
    MatMenuModule,

    // ng2-toastr
    ToastrModule,

    // core components
    PageTemplateTdNavLayoutComponent,
    MatDialogEditorComponent,
    ProgressBarComponent,
    StatusVizualizerComponent,
    StartComponent,
    MainComponent,
    SideFloatOverComponent,
    ErrorPageComponent
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: AuthenticationServiceSettings, useValue: AUTHENTICATIONSERVICE_SETTINGS
    },
    {
      provide: AuthenticationService, useClass: AuthenticationService
    },
    /*{
      provide: BreezeManagerSettings,
      useValue: <BreezeManagerSettings>BREEZEMANAGER_SETTINGS
    },*/
    {
      provide: NavigationBuildingService, useClass: NavigationBuildingService
    },
    {
      provide: AppInitializer, useClass: AppInitializer
    },
    // BreezeEntityRepository,

    Errorhandler,
    Utilities,
   // BreezeManager,

    ProgressBarService,
    ClipboardService,

    TdSimpleDialogServices,

  ]
})
export class CoreModule {
  // export the core services, zodat die slechts 1 keer wordt
  // geinstancieerde in is beschikbaar in de 'golabal injection pool' bij het gebruik in verschillende lazy loaded modules.
  // dus worden gebruikt als Singleton service.
  static forRoot(/*configSettings: CoreConfigSettings*/): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
       // BreezeManager,
       // BreezeManagerProvider,
        GuardRouteAuth,
        GuardDataReady
        // ,GuardPendingChanges
      ]
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    } else {
      // initialiseer de base DI injector om die later te gebruiken asl STATIC class.
      // zo kunnen basis services vb HTTPClient worden opgeehaald zonder die te injecteren in de constructor van de classes
      // vb base.ts: BaseWithServices; wordt gebruikt als base class waar de services aanwezig zijn.
      // vb breezemanager gebruikt BaseWithServices als base class

      BaseServiceLocator.buildInjector(baseServices);
      console.log('building the baseservice locator');
    }
  }
}
