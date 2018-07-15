import { BaseBreezeEntity } from './../../../core-module/models/breeze.entity';

import { Strafstudie } from './Strafstudie.model';
import { StrafstudieType } from './StrafstudieType.model';
import { SmartschoolLeerKracht } from '../../../shared-smartschool-module/models/SmartschoolLeerkracht.model';


export class StrafstudieSessie extends BaseBreezeEntity {
  id: string;
  smartschoolIdLeerkracht: string;
  strafstudieTypeId: string;
  tijdstipBegin: Date;
  tijdstipEinde: Date;

  // virtual
  strafstudies: Strafstudie[];
  leerkracht: SmartschoolLeerKracht;
  strafstudieType: StrafstudieType;
}
