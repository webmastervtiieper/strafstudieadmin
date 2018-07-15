import { HttpParams } from '@angular/common/http';

import { ENTITY_TYPE_NAMES } from './entityNames.const';
import { SmartschoolLeerling } from '../models/SmartschoolLeerling.model';
import { BreezeEntityRepository } from '../../core-module/base-classes/breeze-entity-repository';
import { SmartschoolBreezemanager } from '../services/smartschool-breeze-manager.service';

export class BreezeRepositorySmartschoolLeerling extends BreezeEntityRepository<SmartschoolLeerling> {
  constructor(breezeManager: SmartschoolBreezemanager) {
    super('Leerlingen', breezeManager, 'leerlingen', ENTITY_TYPE_NAMES.smartschoolLeerling, null, false);
  }

  /**
   * Haal de leerlingen van de klas, als de leerling niet bestaat, ATTACH to EntityManager.
   * @param klasNaam
   */
  getAllInKlas(klasNaam: string) {
    let requestParams = new HttpParams();
    requestParams = requestParams.append('klasNaam', klasNaam);
    const url = this.entityManager.dataService.serviceName + 'leerlingen';
    this.breezeManager.httpClient
      .get(url, { params: requestParams })
      .subscribe((lln: SmartschoolLeerling[]) => {
        lln.forEach((ll: SmartschoolLeerling) => {
          try {
            if (this.entityManager.getEntityByKey(ENTITY_TYPE_NAMES.smartschoolLeerling, ll.internnummer) === null) {
              // tslint:disable-next-line:max-line-length
              const newLL: SmartschoolLeerling = <SmartschoolLeerling>(this.entityManager.createEntity(ENTITY_TYPE_NAMES.smartschoolLeerling));
              for (const property in ll) {
                if (ll.hasOwnProperty(property)) {
                  newLL[property] = ll[property];
                }
              }
              this.entityManager.attachEntity(newLL);
            }
          } catch (e) {
            console.error(e);
          }
        });
        const d = this.entityManager.getEntities(ENTITY_TYPE_NAMES.smartschoolLeerling);
      });
  }
}
