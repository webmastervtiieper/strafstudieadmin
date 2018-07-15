import { Injectable } from '@angular/core';
import { BreezeUnitOfWork } from '../../core-module/base-classes/breeze-unit-of-work';

import { SmartschoolBreezemanager } from './smartschool-breeze-manager.service';
import { BreezeRepositorySmartschoolKlas } from '../repositories/smartschoolKlas.repository';
import { BreezeRepositorySmartschoolLeerkracht } from '../repositories/smartschoolLeerkracht.repository';
import { BreezeRepositorySmartschoolVak } from './../repositories/smartschoolVak.repository';
import { BreezeRepositorySmartschoolLeerling } from './../repositories/smartschoolLeerling.repository';

/**
 * WORDT GEINJECTEERD, de contstructor bevat ook injectable services, die moeten
 */

@Injectable()
export class SmartschoolBreezeUnitOfWork extends BreezeUnitOfWork {
  dsSmartschoolKlas: BreezeRepositorySmartschoolKlas;
  dsSmartschoolLeerkracht: BreezeRepositorySmartschoolLeerkracht;
  dsSmartschoolLeerling: BreezeRepositorySmartschoolLeerling;
  dsSmartschoolVak: BreezeRepositorySmartschoolVak;
  constructor(smartschoolBreezemanager: SmartschoolBreezemanager) {
    super(smartschoolBreezemanager);
    this.dsSmartschoolKlas = new BreezeRepositorySmartschoolKlas(smartschoolBreezemanager);
    this.dsSmartschoolLeerkracht = new BreezeRepositorySmartschoolLeerkracht(smartschoolBreezemanager);
    this.dsSmartschoolLeerling = new BreezeRepositorySmartschoolLeerling(smartschoolBreezemanager);
    this.dsSmartschoolVak = new BreezeRepositorySmartschoolVak(smartschoolBreezemanager);

    this.addRepository(this.dsSmartschoolKlas);
    this.addRepository(this.dsSmartschoolLeerkracht);
    this.addRepository(this.dsSmartschoolLeerling);
    this.addRepository(this.dsSmartschoolVak);
  }
}
