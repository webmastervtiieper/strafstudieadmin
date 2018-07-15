import { SMARTSCHOOL_BREEZEMANAGER_SETTINGS } from './shared-smartschool.settings';
import { CoreModule } from './../core-module/core.module';

import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';
import { SmartschoolBreezemanagerSettings } from './services/smartschool-breezemanager-settings.service';
import { SmartschoolBreezeUnitOfWork } from './services/smartschool-unit-of-work';
import { SmartschoolBreezemanager } from './services/smartschool-breeze-manager.service';


@NgModule({
    declarations: []
    , imports: [
        CoreModule.forRoot()
    ]
    , exports: [
        CoreModule
    ]
    , entryComponents: []
    , providers: [
      {
        provide: SmartschoolBreezemanagerSettings,
        useValue: SMARTSCHOOL_BREEZEMANAGER_SETTINGS
      },
      SmartschoolBreezemanager,
      SmartschoolBreezeUnitOfWork
       /* {
            provide: MAIN_MENU_SETTINGS,
            useClass: MainMenuSettings
        }*/
    ]
})
export class SharedSmartschoolModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedSmartschoolModule
        };
    }
    constructor( @Optional() @SkipSelf() parentModule: SharedSmartschoolModule) {
        if (parentModule) {
            throw new Error('SharedSmartschoolModule is already loaded. Import it in the AppModule only');
        }
    }
}
