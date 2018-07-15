import { Injectable } from '@angular/core';
import { IConfirmConfig, TdDialogService, IAlertConfig } from '@covalent/core';

export class CustomError extends Error {
  origine: string;
  constructor(
    boodschap: string,
    origine?: string,
    titel?: string,
    stack?: string
  ) {
    super();
    this.message = boodschap;
    this.origine = origine;
    this.stack = stack || 'Bron onbekend';
    this.name = titel || 'Fout';
  }
}

@Injectable()
export class TdSimpleDialogServices {
  constructor(private tdDialogService: TdDialogService) {}

  public openConfirmDialogRemove(
    message: string = 'Dit item en alle afhankelijkheden wordt permanent verwijderd. Zeker weten?'
  ) {
    const c: IConfirmConfig = <IConfirmConfig>{};
    c.title = 'Verwijderen';
    c.cancelButton = 'Annuleer';
    c.acceptButton = 'Verwijder';
    c.disableClose = true;
    c.message = message;
    return this.tdDialogService.openConfirm(c).afterClosed();
  }

  public openAlertDialog(message: string = 'Alert boodschap') {
    const c: IAlertConfig = <IAlertConfig>{};
    c.title = 'Let op';
    c.closeButton = 'Ok';
    c.disableClose = false;
    c.message = message;
    return this.tdDialogService.openAlert(c).afterClosed();
  }

  public openConfirmDialog(
    message: string = 'Zeker weten?',
    textCancelbutton = 'Nee',
    textOkbutton = 'Ja'
  ) {
    const c: IConfirmConfig = <IConfirmConfig>{};
    c.title = 'Bevestig';
    c.cancelButton = textCancelbutton;
    c.acceptButton = textOkbutton;
    c.disableClose = true;
    c.message = message;
    return this.tdDialogService.openConfirm(c).afterClosed();
  }

  public openMultipleErrorsDialog(errors: CustomError[], textOkbutton = 'Ok') {
    const c: IAlertConfig = <IAlertConfig>{};
    c.title = 'Fouten';
    c.closeButton = textOkbutton;
    c.disableClose = false;
    let message = '<ul>';

    // maak een id die tijdelijk in de alert dialog wordt gebruikt als tekstmessage.
    // ga dan op zoek naar de alertbox met deze id als tekst en vervang de tekst door de eigenlijke boodschap;
    const id = Math.floor((1 + Math.random()) * 0x10000).toString();
    c.message = id;

    errors.forEach(e => {
      message += '<li><b>' + e.origine + ':</b> ' + e.message + '</li>';
    });
    message += '</ul>';

    const ref = this.tdDialogService.openAlert(c);

    setTimeout(function() {
      const dialogs = document.getElementsByTagName('td-alert-dialog');
      const aantalAlertDialogs = dialogs.length;
      let alertDialog: Element;
      for (let i = 0; i < dialogs.length; i++) {
        if (
          dialogs
            .item(i)
            .getElementsByTagName('td-dialog-content')
            .item(0)
            .innerHTML.includes(id)
        ) {
          alertDialog = dialogs.item(i);
          break;
        }
      }
      alertDialog
        .getElementsByTagName('td-dialog-content')
        .item(0).innerHTML = message;
    }, 250);

    return ref.afterClosed();
  }
}
