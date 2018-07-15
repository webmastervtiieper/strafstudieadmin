

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { ENTITY_TYPE_NAMES } from './entityNames.const';

import { SmartschoolVak } from './../models/SmartschoolVak.model';

import { SmartschoolBreezemanager } from '../services/smartschool-breeze-manager.service';
import { BreezeEntityRepository } from '../../core-module/base-classes/breeze-entity-repository';
import { VakkenPerLeerkracht } from '../models/VakkenPerLeerkracht.model';

export class BreezeRepositorySmartschoolVak extends BreezeEntityRepository<SmartschoolVak> {
  vakkenPerLeerkracht: VakkenPerLeerkracht[] = [];
  constructor(breezeManager: SmartschoolBreezemanager) {
    super(
      'Vakken',
      breezeManager,
      'vakken',
      ENTITY_TYPE_NAMES.smartschoolVak,
      null,
      true
    );
  }

  /**
   * smartchoolvakken voor een bepaalde leerkracht halen, smartschool API
   * @param leerkrachtId
   */
  vakkenByLeerkracht(leerkrachtId: string) {
    const vakkenFetched: Subject<SmartschoolVak[]> = new Subject();
    const vakkenVanLeekracht = this.vakkenPerLeerkracht.filter(vpl => {
      return vpl.leerkrachtId === leerkrachtId;
    });
    if (vakkenVanLeekracht.length > 0) {
      vakkenFetched.next(vakkenVanLeekracht[0].vakken);
    } else {
      let requestParams = new HttpParams();
      requestParams = requestParams.append('leerkrachtId', leerkrachtId);
      const url = this.entityManager.dataService.serviceName + 'vakken';
      this.breezeManager.httpClient
        .get(url, { params: requestParams })
        .subscribe((vakken: SmartschoolVak[]) => {
          this.vakkenPerLeerkracht.push({
            leerkrachtId: leerkrachtId,
            vakken: vakken
          });
          vakkenFetched.next(vakken);
        });
    }
    return vakkenFetched;
  }
}
