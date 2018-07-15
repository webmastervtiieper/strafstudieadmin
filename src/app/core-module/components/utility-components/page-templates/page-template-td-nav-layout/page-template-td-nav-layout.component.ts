import { AuthenticationService } from './../../../../services/base/authentication.service';
import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';


import { Router } from '@angular/router';

import { MatButton } from '@angular/material';
import { TdLayoutNavComponent } from '@covalent/core';
import { TdSimpleDialogServices } from '../../../../services/utility-services/td-dialog-services';
import { ProgressBarService } from '../../progress-bar/progress-bar-service';
import { BreezeEntityRepository } from '../../../../base-classes/breeze-entity-repository';
import { Entity } from 'breeze-client';


@Component({
  selector: 'page-template-td-nav-layout',
  templateUrl: './page-template-td-nav-layout.component.html'
})
export class PageTemplateTdNavLayoutComponent implements OnInit, OnChanges  {
  busy = false;
  toolbarTitle;
  subTitle;
  mainTitle;

  showProgressBar = false;
  // tslint:disable-next-line:no-input-rename
  @Input('dataService') dataService: BreezeEntityRepository<Entity>;
  // tslint:disable-next-line:no-input-rename
  @Input('pageTitle') pageTitle = null;
  // tslint:disable-next-line:no-input-rename
  @Input('firmaNaam') firmaNaam = null;

  @ViewChild('btnLogout') btnLogout: MatButton;
  @ViewChild('btnAccount') btnAccount: MatButton;
  @ViewChild('tdLayoutNav') tdLayoutNav: TdLayoutNavComponent;

  constructor(private router: Router,
     private progessBarService: ProgressBarService,
     private authService: AuthenticationService,
     private tdSimpleDialogServices: TdSimpleDialogServices) { }

  ngOnInit() { }

  ngOnChanges() {
    this.toolbarTitle = this.pageTitle || '';
  }


  btnLogout_clicked() {
    this.tdSimpleDialogServices.openConfirmDialog('Uitloggen, zeker weten?').subscribe((ok) => {
      if (ok) {
       /*
       this.authService.logout()
       this.authService.redirectToAuthenticator()
       */
      }
    });
  }

  btnAccount_clicked() {
    this.tdSimpleDialogServices.openAlertDialog('Naar account gegevens');
  }

}
