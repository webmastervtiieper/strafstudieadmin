import { HttpClient } from '@angular/common/http';


import { BreezeManager } from '../../core-module/base-classes/breeze-manager';
import { SmartschoolBreezemanagerSettings } from './smartschool-breezemanager-settings.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SmartschoolBreezemanager extends BreezeManager {
  constructor(httpClient: HttpClient, breezemanagerSettings: SmartschoolBreezemanagerSettings) {
    super(httpClient, breezemanagerSettings);
  }
}
