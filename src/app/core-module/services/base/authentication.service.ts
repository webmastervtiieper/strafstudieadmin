import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';


// import { AuthHttp, AuthConfig,  IAuthConfigOptional } from 'angular2-jwt/angular2-jwt';
// import { JWT_SETTINGS } from '../../../app.settings';
import { Errorhandler, applicationError } from '../utility-services/error-handler.service';

/**
 * Settings voor authentication service
 */
export class AuthenticationServiceSettings {
  authenticatieApiHost: string;
  authenticationApiEndpointRoute: string;
  // applicationRedirectUrl: 'http:// localhost:8003'
  // 'http:// adminvtii.azurewebsites.net/authentication'
  // window.location.origin
  // doel-url na succesvolle authenticatie van OAuth service
  toLoginIfTokenExpired?: boolean; // geeft aan of naar de loginpagina moet worden teruggekeerd
                                // als het login token verstreken is; vb in authenticated.guard
  showToastr: boolean; // geeft aan of een toastr moet worden getoond; ngx-toastr module
  logoutUrl: string;
  loginRedirectUrl: string;
  intervalForLoginCheck?: number = 3 * 60 /*minuten x seconden*/;
  state: string = null;
}

export interface IBasicUserInfo {
  userID?: string;
  name: string;
  surname: string;
  fullname: string;
  username: string;
}

export interface JWTHeaderOptions {
  tokenGetter?: () => string | Promise<string>;
  headerName?: string;
  authScheme?: string;
  whitelistedDomains?: Array<string | RegExp>;
  throwNoTokenError?: boolean;
  skipWhenExpired?: boolean;
}

export enum AuthenticationSatus {
  loggedIn,
  notLoggedIn,
  timedOut
}

@Injectable()
export class AuthenticationService/* extends BaseWithServices*/ {
  // #REGION privates
  // private _authorisationHeaderScheme  = JWT_SETTINGS.authScheme || 'Bearer ';
  // private _authorisationHeaderName = JWT_SETTINGS.headerName || 'Authorization';
  private _basicUserInfoFetchingMaxAttempts = 5;
  private _basicUserInfoFetchingCount = 0;
  private _basicUserInfoFetched = false;
  private _basicUserInfo: IBasicUserInfo = {
    fullname: 'Volledige naam',
    name: '',
    surname: '',
    userID: '',
    username: 'Gebruikersnaam'
  };
  private _basicUserInfoChanged = new Subject<IBasicUserInfo>();
  private _intervalForLoginCheck = 3 * 60 /*minuten x seconden*/;
  private _intervalForFetchingUserInfoId;
  private _intervalForLoginCheckId;
  private _authenticationStatus: AuthenticationSatus = AuthenticationSatus.notLoggedIn;
  private _authenticationStatusChanged = new Subject<AuthenticationSatus>();
  private _isInDebugMode = false;

  private _redirectToLogin: boolean;
  private _showToastr: boolean;
  // / #END REGION privates

  //  #REGION public properties
  set isInDebugMode(v: boolean) {
    this._isInDebugMode = v;
  }
  get isInDebugMode() {
    return this._isInDebugMode;
  }

  //   get authorisationHeaderScheme() {return this._authorisationHeaderScheme}
  //  get authorisationHeaderName() {return this._authorisationHeaderName}

  get authenticationStatus(): AuthenticationSatus {
    return this._authenticationStatus;
  }
  /**
   * Stel het tijdsinterval in van de logincheck
   * @param value : waarde in 'minuten'
   */
  set intervalForLoginCheck(value: number) {
    this._intervalForLoginCheck = value * 60;
  }
  // /# END REGION public properties

  /**
   * Haal het accesstoken uit local storage
   * null indien niet aanwezig
   */
  get accessToken() {
    return localStorage.getItem('access_token');
  }
  get authenticatieApiHost() {
    return this.serviceSettings.authenticatieApiHost;
  }
  get authenticationApiEndpointRoute() {
    return this.serviceSettings.authenticationApiEndpointRoute;
  }
  get authenticationStatusChanged() {
    return this._authenticationStatusChanged;
  }
  get isLoggedIn() {
    return (
      this._isInDebugMode ||
      this._authenticationStatus === AuthenticationSatus.loggedIn
    );
  }
  get basicUserInfo() {
    return this._basicUserInfo;
  }
  get basicUserInfoStateChanged() {
    return this._basicUserInfoChanged;
  }

  constructor(
    private httpClient: HttpClient,
    private serviceSettings: AuthenticationServiceSettings,
    private eh: Errorhandler
  ) {
    // initialiseer de authenticationstatus; als er een access token aanwezig is, dan is de gebruikter geauthenticeerd.
    this._redirectToLogin = this.serviceSettings.toLoginIfTokenExpired === null ? true : this.serviceSettings.toLoginIfTokenExpired  ;
    this._showToastr = this.serviceSettings.showToastr === null ?  true : this.serviceSettings.showToastr;
    this._authenticationStatus = this.accessToken
      ? AuthenticationSatus.loggedIn
      : AuthenticationSatus.notLoggedIn;

   /* this._intervalForFetchingUserInfoId = setInterval(() => {
      if (
        this._basicUserInfoFetched || this._basicUserInfoFetchingCount === this._basicUserInfoFetchingMaxAttempts
      ) {
        clearInterval(this._intervalForFetchingUserInfoId);
        this._basicUserInfoChanged.next(this._basicUserInfo);
        this._basicUserInfoChanged.complete();
      }
      this._basicUserInfoFetchingCount++;
      this.getUserDataFromServer();
    }, 3000);*/

    this._intervalForLoginCheckId = setInterval(() => {
      this._checkAccessTokenValidity(false);
    }, this._intervalForLoginCheck * 1000);
  }

  /**
   * Redirect naar de login url voor authenticatie
   */
  public redirectToAuthenticator() {
    clearInterval(this._intervalForLoginCheckId);
    localStorage.removeItem('access_token');
    window.location.replace(this.serviceSettings.loginRedirectUrl + '?state=' + this.serviceSettings.state);
  }

  /**
   * Controleer op de server of de loginstatus ok is
   */
  public checkLoginStatus(
    redirectToLogin: boolean = this._redirectToLogin,
    showToastr: boolean = this._showToastr
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      console.group('CHECKING LOGIN STATUS');
      console.log('Accesstoken: ', this.accessToken);
      if (this._isInDebugMode) {
        resolve();
      } else {
        this._checkAccessTokenValidity(redirectToLogin, showToastr)
          .then(() => {
            resolve();
          })
          .catch(reason => {
            reject(reason);
          });
      }
      console.groupEnd();
    });
  }

  private _checkAccessTokenValidity(
    redirectToLogin: boolean = this._redirectToLogin,
    showToastr: boolean = this._showToastr
  ): Promise<void> {
    return new Promise((resolve, reject) => {
        this.httpClient
          .head(this._apiMethod('isTokenValid'))
          .toPromise()
          .then(() => {
            if (this._authenticationStatus === AuthenticationSatus.notLoggedIn) {
              this._authenticationStatus = AuthenticationSatus.loggedIn;
              this._authenticationStatusChanged.next(this._authenticationStatus);
            }
            resolve();
          })
          .catch(e => {
            this._processUnauthenticated();
            reject('Access token timed out');
          });
    });
  }

  private _processUnauthenticated() {
      this._authenticationStatus = AuthenticationSatus.notLoggedIn;
      this._authenticationStatusChanged.next(AuthenticationSatus.notLoggedIn);
      if (this._showToastr) {
        this.eh.handleApplicationError(applicationError.http401).subscribe(() => {
          if (this._redirectToLogin) { this.redirectToAuthenticator(); }
        });
      } else {
        if (this._redirectToLogin) { this.redirectToAuthenticator(); }
      }
  }
  /**
   * Bepaal of de gebruiker toegang heeft tot de applicatie
   */
  private _getUserPermissionsToApp() {}


  private _apiMethod(endpoint: string) {
    return (
      this.serviceSettings.authenticatieApiHost +
      this.serviceSettings.authenticationApiEndpointRoute +
      endpoint
    );
  }

  /**
   * haal de gebruikers info van de ingelogde gebruiker
   */
  public getUserDataFromServer() {
    return new Promise((resolve, reject) => {
      this.httpClient
      .get(this._apiMethod('userInfo'))
      .toPromise()
      .then(
        (result: IBasicUserInfo) => {
          this._basicUserInfo = result;
          this._basicUserInfoFetched = true;
          this._basicUserInfoChanged.next(this._basicUserInfo);
          resolve(this._basicUserInfo);
        }).catch(e => {
          this._processUnauthenticated();
          reject('can not fetch userinfo');
        });
    });
  }

  public hasPermissionToRoute(appId: string, routeId: string) {}
}
