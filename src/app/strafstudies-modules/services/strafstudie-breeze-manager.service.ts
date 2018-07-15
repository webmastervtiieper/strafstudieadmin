import { HttpClient } from '@angular/common/http';
import { StrafstudieBreezemanagerSettings } from './../../strafstudies-modules/services/strafstudie-breezemanager-settings.service';
import { BreezeManager } from '../../core-module/base-classes/breeze-manager';
import { Injectable } from '@angular/core';


@Injectable()
export class StrafstudieBreezemanager extends BreezeManager {
  constructor(httpClient: HttpClient, strafstudieBreezemanagerSettings: StrafstudieBreezemanagerSettings) {
    super(httpClient, strafstudieBreezemanagerSettings);
  }
}
