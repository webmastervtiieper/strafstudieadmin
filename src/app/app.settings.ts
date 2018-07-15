import {
  AuthenticationServiceSettings
} from './core-module/services/base/authentication.service';

import { CoreConfigSettings } from './core-module/core.module';

export const APPCORE_SETTINGS: CoreConfigSettings = <CoreConfigSettings>{
  appId: 'd9737e58-3613-40ea-92c8-2cffee8e4034',
  firmaNaam: 'VTI Ieper',
  // fotoManagerApiRoute: 'http:// seminfobov2.azurewebsites.net/api/v1/fotos/',
  // userManagerApiRoute: 'v1/usermanager/',
  // connectionWebApiRoute: 'v1/connection/',
  // mailApiRoute :'http:// 192.168.1.252:1007/',
  // 'http:// api.cryptosaldo.be/' ,//  'http:// 192.168.1.252:1007/',
  // 'http:// api.cryptosaldo.be/' ,// http:// 192.168.1.252:1006/api',

  //  language: 'nl',
};

export const TOOLKITAPI_SETTINGS = {
  host: 'http://localhost:8004/',
  routes: {
    toolkitRoutes: { appsApi: 'api/v1/apps/' }
  }
};


/**
 * serviceName_Url: api van strafstudie
 *//*
export const BREEZEMANAGER_SETTINGS: BreezeManagerSettings = {
  serviceName_Url: 'http://localhost:8002/',
  serviceName_Route: 'api/v1/breeze/'
};*/

// settings van de smartschool authentication service
export const AUTHENTICATIONSERVICE_SETTINGS: AuthenticationServiceSettings = {
  authenticatieApiHost: 'http://localhost:8001/',
   //   'http:// localhost:51029/'  // host; server voor de authenticatie services
  authenticationApiEndpointRoute: 'api/v1/auth/',
  toLoginIfTokenExpired: true, // can be overridden in checkloginstatus function()
  showToastr: true, // can be overridden in checkloginstatus function()

  // route naar api controller voro authenticatie, alle methodes voor authenticatie zijn vervat in deze controller
  //  , applicationRedirectUrl: 'http:// localhost:8003'
  // 'http:// adminvtii.azurewebsites.net/authentication'
  //  window.location.origin // doel-url na succesvolle authenticatie van OAuth service
  logoutUrl: 'https://vti-ieper.smartschool.be/Authentication/index/logout', // url gebruikt voor logout
  intervalForLoginCheck: 3 * 60,
  loginRedirectUrl: 'http://localhost:8003/home/redirectToAuth',
  // url van de APP waar wordt geredirect in geval de authenticatiesessie is verlopen, dus als het OAuth JWT access-token is verlopen
  state: 'strafstudieAdmin'
};
