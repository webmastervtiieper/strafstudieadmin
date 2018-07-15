import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';
import { StrafstudiesModule } from './strafstudies-modules/strafstudies.module';
import { AppBreezeUnitOfWorkRepository } from './app-unit-of-work-repository';

@NgModule({
  declarations: [
    AppComponent
  ]
  , imports:
  [
    /* BrowserModule, BrowserAnimationsModule
    , BreezeBridgeHttpClientModule, HttpClientModule */
     AppRoutingModule
    , StrafstudiesModule
  ]
  , providers: [
    AppBreezeUnitOfWorkRepository
  ]
  , bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
