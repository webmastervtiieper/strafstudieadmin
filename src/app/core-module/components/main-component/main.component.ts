import { NavigationBuildingService } from './../../base-classes/navigation-building-service.service';
import { Component, ViewChild, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';

import {
  TdLayoutComponent,
  TdNavigationDrawerComponent,

} from '@covalent/core';

import { AuthenticationService } from '../../../core-module/services/base/authentication.service';
import { IRouteMenuItem } from '../../base-classes/typings/menuItems';

// import { ROUTE_NAMES } from '../../../app.settings';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'main',
  templateUrl: './main.component.html'
  // styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  @ViewChild('mainLayout') mainLayout: TdLayoutComponent;
  @ViewChild('mainDrawer') mainDrawer: TdNavigationDrawerComponent;

  iconname = 'library_books';
  sideNavTitle = ' VTI Strafstudie beheer';
  logo = 'logo';
  userNickname = 'Gebruiker';
  userEmail = '';
  menuItems: IRouteMenuItem[];

  //  @ViewChild('#mainDrawerMenu') mainDrawerMenu:TdNavigationDrawerComponent;
  /**
   *
   * @param router
   * @param authService
   * @param uow
   * @param mainMenuSettings : settings in App.Settings ingesteld
   */
  constructor(
    private authService: AuthenticationService,
    private navigationBuildingService: NavigationBuildingService
  ) {
  }

  ngOnInit() {
    this.menuItems = this.navigationBuildingService.appRouteMenuItems;
    this.userNickname = this.authService.basicUserInfo.fullname;
    this._initObservables();

    // De authenticatie service haalt de 'gebruikersinfo', het proces gebruikt een observable om de info op te slaan
    // Indien de 'gebruikers info' is opgehaald wordt 'promise' completed.
    // Subscribe op dit proces en haal de gebruikers gegevens die in authenticatie service zijn bewaard


    // generate pages routes

    // haal de klant gegevens adhv
    /* this.unitOfWork.dsKlantGebruiker.data.subscribe((value) => {
      console.log(value);
      if (value.length > 0) {
        this.unitOfWork.dsKlantManager.byId(value[0].klant.klantManagerId);
         // haal de klantmangaer gegevens uit breeze manager en populate de klantmanagerrepository;
          de klant data werd reeds in breeze geladen door de klantgebruiker call : data in de repo
        // this.sideNavTitle = value[0].klantManager.naam;
      }
    });*/
  }

  private _initObservables() {
    this.authService.basicUserInfoStateChanged
    .subscribe((basicUserInfo) => {
      this.userNickname = basicUserInfo.fullname;
    });
   }

  logout(): void {
    /*this.authService.signOut().then(()=>{ localStorage.clear();
      window.location.reload();
     })*/
  }

  ngOnDestroy() {}

  menuLogout_clicked() {}
  menuAccount_clicked() {}
}
