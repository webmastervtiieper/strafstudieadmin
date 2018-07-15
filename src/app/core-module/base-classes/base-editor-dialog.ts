import { OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatButton, MatDialogRef } from '@angular/material';
import { TdDialogService, IConfirmConfig } from '@covalent/core';

import {
  ObservableInput,
  Subscription,
  Subject,
  Observable,
  combineLatest
} from 'rxjs';

export class MatDialogEditorReadyArgs {
  closeButton: MatButton;
  saveButton: MatButton;
}

export class MdDialogEditData implements OnInit, OnDestroy {
  componentDestroyed = new Subject<void>();
  savePending = false;
  hasChanges = false;
  subscriptionWatchSaveactions: Subscription;
  mdDialogTitleIconName = 'subject'; // md-icon name voor titel van dialog screent;
  mdDialogTitle = 'Dialog titel';

  /*@ViewChild('btnClose')*/ btnClose: MatButton; //
  /*@ViewChild('btnSave')*/ btnSave: MatButton;
  constructor(
    protected dialogref: MatDialogRef<MdDialogEditData>,
    protected tdDialogService: TdDialogService,
    protected saveActionsToWatch: ObservableInput<any>[]
  ) {}

  ngOnDestroy() {
    this.componentDestroyed.next();
    this.componentDestroyed.complete();
  }

  ngOnInit() {
    console.warn('Derived class has no ngOnInit override; create one');
    // init: get the data from 'dialogRef.config.data';
  }

  checkForChanges() {
    console.warn('Derived class has no checkForChanges override; create one');
    // controleer of de entity; must be overridden in derived class
  }
  saveChanges() {
    console.warn('Derived class has no saveChanges override; create one');
  }

  /** */
  rejectChanges() {
    console.warn('Derived class has no rejectChanges override; create one');
  }

  onDialogReady(event: MatDialogEditorReadyArgs) {
    this.btnClose = event.closeButton;
    this.btnSave = event.saveButton;
    // console.log(event);
  }

  btnClose_clicked(button) {
    // console.log('editor close btn clicked', button);
    this.handleChanges();
  }

  btnSave_clicked(button) {
    // console.log('editor save btn clicked', button);
    this.initSaveChanges();
  }

  handleChanges() {
    this.checkForChanges();
    if (this.hasChanges) {
      this.openConfirmDialogHasChanges()
        .afterClosed()
        .subscribe(accept => {
          if (accept) {
            // bewaar
            this.initSaveChanges();
          } else {
            this.rejectChanges();
            this.dialogref.close();
          }
        });
    } else {
      this.dialogref.close();
    }
  }

  initSaveChanges() {
    this.subscriptionWatchSaveactions = combineLatest(
      this.saveActionsToWatch
    ).subscribe(r => {
      //  this.btnSave.disabled = false;
      //  this.btnClose.disabled = false;
      this.savePending = false;
    });

    this.savePending = true;
    // this.btnSave.disabled = true; this.btnClose.disabled = true;
    this.saveChanges();
  }

  openConfirmDialogHasChanges() {
    const c: IConfirmConfig = <IConfirmConfig>{};
    c.title = 'Wijzigingen';
    c.cancelButton = 'Niet bewaren';
    c.acceptButton = 'bewaren';
    c.disableClose = true;
    c.message =
      'Er zijn wijzigingen aangebracht. Wenst u deze wijzigingen te bewaren?';
    return this.tdDialogService.openConfirm(c);
  }
}
