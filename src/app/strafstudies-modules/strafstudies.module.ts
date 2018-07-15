import { NgModule } from '@angular/core';
import { SharedSmartschoolModule } from '../shared-smartschool-module/shared-smartschool.module';

import { StrafstudieBreezemanagerSettings } from './services/strafstudie-breezemanager-settings.service';
import { STRAFSTUDIE_BREEZEMANAGER_SETTINGS } from './strafstudie.settings';

import { StrafstudietypesPageComponent } from './components/strafstudietypes/strafstudietypes-page/strafstudietypes-page.component';
// tslint:disable-next-line:max-line-length
import { StrafstudietypeDetailPageComponent } from './components/strafstudietypes/strafstudietype-detail-page/strafstudietype-detail-page.component';
// tslint:disable-next-line:max-line-length
import { StrafstudietypesLijstComponent } from './components/strafstudietypes/strafstudietypes-lijst/strafstudietypes-lijst.component';
// tslint:disable-next-line:max-line-length
import { StrafstudieaanvraagDetailPageComponent } from './components/strafstudieaanvragen/strafstudieaanvraag-detail-page/strafstudieaanvraag-detail-page.component';
// tslint:disable-next-line:max-line-length
import { StrafstudieaanvragenLijstItemComponent } from './components/strafstudieaanvragen/strafstudieaanvragen-lijst-item/strafstudieaanvragen-lijst-item.component';
// tslint:disable-next-line:max-line-length
import { StrafstudieaanvragenLijstComponent } from './components/strafstudieaanvragen/strafstudieaanvragen-lijst/strafstudieaanvragen-lijst.component';
// tslint:disable-next-line:max-line-length
import { StrafstudieaanvragenPageComponent } from './components/strafstudieaanvragen/strafstudieaanvragen-page/strafstudieaanvragen-page.component';
// tslint:disable-next-line:max-line-length
import { StrafstudietypesLijstItemComponent } from './components/strafstudietypes/strafstudietypes-lijst-item/strafstudietypes-lijst-item.component';
// tslint:disable-next-line:max-line-length
import { StrafstudieaanvraagEditDialogComponent } from './components/strafstudieaanvragen/strafstudieaanvraag-edit-dialog/strafstudieaanvraag-edit-dialog.component';
import { StrafstudieBreezeUnitOfWork } from './services/strafstudie-unit-of-work';
import { StrafstudieBreezemanager } from './services/strafstudie-breeze-manager.service';


@NgModule({
  imports: [ SharedSmartschoolModule.forRoot()], /*CoreModule.forRoot(),*/
  declarations: [
    StrafstudietypesPageComponent,
    StrafstudietypesLijstComponent,
    StrafstudietypesLijstItemComponent,
    StrafstudietypeDetailPageComponent,

    StrafstudieaanvragenPageComponent,
    StrafstudieaanvragenLijstComponent,
    StrafstudieaanvragenLijstItemComponent,
    StrafstudieaanvraagDetailPageComponent,

    StrafstudieaanvraagEditDialogComponent
  ],
  exports: [
    StrafstudietypesPageComponent,
    StrafstudietypesLijstComponent,
    StrafstudietypesLijstItemComponent,
    StrafstudietypeDetailPageComponent,

    StrafstudieaanvragenPageComponent,
    StrafstudieaanvragenLijstComponent,
    StrafstudieaanvragenLijstItemComponent,
    StrafstudieaanvraagDetailPageComponent,

    StrafstudieaanvraagEditDialogComponent,

    // module exporteren zodat ze zichtbaar zijn in de app.module
    SharedSmartschoolModule
  ]
  , providers:  [
    {
      provide: StrafstudieBreezemanagerSettings,
      useValue: STRAFSTUDIE_BREEZEMANAGER_SETTINGS
    }
    , StrafstudieBreezemanager
    , StrafstudieBreezeUnitOfWork
  ]
})
export class StrafstudiesModule {
  constructor() {}
}
