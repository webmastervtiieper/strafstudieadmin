import { Injectable } from '@angular/core';

import { BreezeUnitOfWorkRepository } from './core-module/base-classes/breeze-unit-of-work-repository';

import { StrafstudieBreezeUnitOfWork } from './strafstudies-modules/services/strafstudie-unit-of-work';
import { SmartschoolBreezeUnitOfWork } from './shared-smartschool-module/services/smartschool-unit-of-work';

import { StrafstudieBreezemanager } from './strafstudies-modules/services/strafstudie-breeze-manager.service';
import { SmartschoolBreezemanager } from './shared-smartschool-module/services/smartschool-breeze-manager.service';

/**
 * WORDT GEINJECTEERD, de contstructor bevat ook injectable services, die moeten
 */
@Injectable()
export class AppBreezeUnitOfWorkRepository extends BreezeUnitOfWorkRepository {

  constructor(
   public strafstudieBreezeUnitOfWork: StrafstudieBreezeUnitOfWork,
   public smartschoolBreezeUnitOfWork: SmartschoolBreezeUnitOfWork
  ) {
    super();
    this.add(this.strafstudieBreezeUnitOfWork);
    this.add(this.smartschoolBreezeUnitOfWork);
   }

}


