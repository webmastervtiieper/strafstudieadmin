import { Observable } from 'rxjs/Rx';
//iedere authenticaiton service
// is het nu Auth0Service of andere moet voldoen onderstaande interface omdat .
export interface IAuthenticationService{
   authenticated:boolean;
   signOut(): Promise<any>;
   authenticationStateChanged(): Observable<boolean>;
   showLoginForm():void;
}
