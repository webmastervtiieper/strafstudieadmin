import { ToastrService, IndividualConfig, ToastRef, ActiveToast } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';


export enum applicationError {
  http401, // http return status 401: unauthorized
  http405,
  noAppId,
  undefined,
  breezeUOWInitData,
  undefinedHttp
}
interface IErrorDescriptions {
   [index: string]: string;
}

interface IErrorBaseDefinition {
  code: applicationError;
  title: string;
  descriptions: IErrorDescriptions;
  fnHandler: ((ed: IErrorBaseDefinition) => Subject<any>);
}

interface IApplicationErrorDefinition extends IErrorBaseDefinition {
  code: applicationError;
}

interface IHttpErrorDefinition extends IErrorBaseDefinition {
  code: number;
}

class CurrentErrorsItem {
  id: string;
  errorCodes: Array<applicationError>;
}

class CurrentErrors {
 items: Array<CurrentErrorsItem>;
  constructor(errorCodes) {
  }

  addError() {

  }
}


@Injectable() // {  providedIn: 'root' }
export class Errorhandler {
  private _applicationErrorDefinitions: IApplicationErrorDefinition[] = [
    {
      code: applicationError.http401,
      title: 'Unauthorized',
      descriptions: { nl: 'U ben niet geautoriseerd of uw autorisatie is verlopen.<br /><br /> Klik hier om opnieuw in te loggen', fr: '' },
      fnHandler: this._handleUnauthorizedError
    },
    {
      code: applicationError.http405,
      title: 'Wrong serer call',
      descriptions: { nl: 'Server methode niet toegelaten', fr: '' },
      fnHandler: this._handleUnauthorizedError
    },
    {
      code: applicationError.undefined,
      title: 'Undefined error',
      descriptions: { nl: '', fr: '' },
      fnHandler: this._handleUndefinedError
    },
    {
      code: applicationError.noAppId,
      title: 'No App Id provided',
      // tslint:disable-next-line:max-line-length
      descriptions: { nl: 'Er werd geen appId gevonden. De toepassing is niet correct gestart. Start de toepassing van het startmenu.', fr: '' },
      fnHandler: this._handleUndefinedAppId
    },
    {
      code: applicationError.undefinedHttp,
      title: 'Undefined http error',
      descriptions: { nl: 'Er is een onverwachte http fout opgetreden bij het ophalen van data.', fr: '' },
      fnHandler: this._handleUndefinedError
    },

  ];

  private _activeToasts: {
  unauthorized: ActiveToast<any>;
  } = { unauthorized: null };
  // END PRIVATE PROPERTIES

  // EXPOSED PROPERTIES
   get applicationErrorDefinitions() {
    return this._applicationErrorDefinitions;
  }
  // END EXPOSED PROPERTIES

  constructor(
    private router: Router,
    private toastrService: ToastrService
  ) {}

  private _getApplicationErrorDefinition(errorCode: applicationError) {
    const ed = this._applicationErrorDefinitions.find((v, i, o) => {
      return v.code === errorCode;
    });
    return ed;
  }

  // ERROR HANDLERS

  private _navigateToErrorPage(ed: IErrorBaseDefinition) {
    this.router.navigate(['/error'], {queryParams: {error: ed.code} })
    .then(() => {

    });
  }


  private _handleNoErrorHandler(): Subject<any> {
    const s = new Subject();
    console.error('FATAL ERROR; no errorhandler provided');
    s.next();
    return s;
  }


  /**
   * als de token expired time out, of token niet aanwezig
   * @param ed
   */
  private _handleUnauthorizedError(ed: IErrorBaseDefinition): Subject<any> {
    const s = new Subject();
    const config = <IndividualConfig>{};
    config.closeButton = true; config.disableTimeOut = true; config.enableHtml = true;
    if (this._activeToasts.unauthorized === null) {
      this._activeToasts.unauthorized = this.toastrService.error(ed.descriptions['nl'], ed.title, config);
      this._activeToasts.unauthorized.onTap.subscribe(() => {
        this._activeToasts.unauthorized = null;
        s.next();
      });
    }
    return s;
  }

  private _handleUndefinedError(ed: IErrorBaseDefinition, extraErrorInfo?: any): Subject<any> {
    const s = new Subject();
    this._navigateToErrorPage(ed);
    s.next();
    return s;
  }

  private _handleUndefinedAppId(ed: IErrorBaseDefinition): Subject<any> {
    const s = new Subject();
    /*const params: Params = {errorCode: ed.code};
    const ne: NavigationExtras =  { queryParams: params };
    this.router.navigate(['error'], ne);*/
    this.toastrService.error(ed.descriptions['nl']);
    s.next();
    return s;
  }


  private _handleError(ed: IErrorBaseDefinition, extraErrorInfo?: any): Subject<any> {
    if (ed && ed.fnHandler) {
      return ed.fnHandler.call(this, ed);
    } else {
      if (ed) {
        return this._handleNoErrorHandler();
      } else {
        return this._handleUndefinedError(ed, extraErrorInfo);
      }
    }
  }

  // EXPOSED METHODS

  handleHttpError(error: HttpErrorResponse): Subject<any> {
    // bepaal de fout definitie

    let errCode = applicationError.undefined; // = (error && error.status) || applicationError.undefined;
    switch (error.status) {
      case 401: {
        errCode = applicationError.http401;
        break;
      }
      case 405: {
        errCode = applicationError.http405;
        break;
      }
      default: {
        errCode = applicationError.undefinedHttp;
        break;
      }
    }
    // handel de fout af
    return this._handleError(this._getApplicationErrorDefinition(errCode));
  }

  handleApplicationError(errCode: applicationError, extraErrorinfo?: any): Subject<any> {
    return this._handleError(this._getApplicationErrorDefinition(errCode), extraErrorinfo);
  }

  getErrorDescription(errorCode: applicationError, language: string = 'nl'): string {
    return this._applicationErrorDefinitions.find((v, i) => {
      return v.code === errorCode;
   }).descriptions[language];
  }

  getErrorTitel(errorCode: applicationError) {
    return this._applicationErrorDefinitions.find((v, i) => {
      return v.code === errorCode;
   }).title;
  }

  getErrorByCode(errorCode: applicationError) {
    return this._applicationErrorDefinitions.find((v, i) => {
      return v.code === errorCode;
   });
  }

  // END EXPOSED METHODS
}
