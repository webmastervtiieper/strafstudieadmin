import { StrafstudieBreezemanager } from './../services/strafstudie-breeze-manager.service';
import { BreezeEntityRepository } from '../../core-module/base-classes/breeze-entity-repository';
import { STRAFSTUDIE_ENTITY_TYPE_NAMES } from './entityNames.const';
import { StrafstudieSessie } from '../models/dbModels/StrafstudieSessie.model';

export class BreezeRepositoryStrafstudieSessie extends BreezeEntityRepository<StrafstudieSessie> {
  constructor(breezeManager: StrafstudieBreezemanager) {
    super('Strafstudie sessies', breezeManager, 'strafstudiesessies', STRAFSTUDIE_ENTITY_TYPE_NAMES.strafstudieSessie, null, true);
  }
}
