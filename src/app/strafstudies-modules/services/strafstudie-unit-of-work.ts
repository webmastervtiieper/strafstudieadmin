import { Injectable } from '@angular/core';
import { StrafstudieBreezemanager } from './strafstudie-breeze-manager.service';
import { BreezeRepositoryStrafstudie } from '../repositories/strafstudie.repository';
import { BreezeRepositoryStrafstudieSessie } from '../repositories/strafstudieSessie.repository';
import { BreezeRepositoryStrafstudieType } from '../repositories/strafstudieType.repository';
import { BreezeUnitOfWork } from '../../core-module/base-classes/breeze-unit-of-work';

/**
 * WORDT GEINJECTEERD, de contstructor bevat ook injectable services, die moeten
 */
@Injectable()
export class StrafstudieBreezeUnitOfWork extends BreezeUnitOfWork {
  dsStrafstudies: BreezeRepositoryStrafstudie;
  dsStrafstudieSessies: BreezeRepositoryStrafstudieSessie;
  dsStrafstudieType: BreezeRepositoryStrafstudieType;

  constructor(strafstudieBreezemanager: StrafstudieBreezemanager) {
    super(strafstudieBreezemanager);


    this.dsStrafstudies = new BreezeRepositoryStrafstudie(this.breezeManager);
    this.dsStrafstudieSessies = new BreezeRepositoryStrafstudieSessie(this.breezeManager);
    this.dsStrafstudieType = new BreezeRepositoryStrafstudieType(this.breezeManager);

    this.addRepository(this.dsStrafstudies);
    this.addRepository(this.dsStrafstudieSessies);
    this.addRepository(this.dsStrafstudieType);
  }
}
