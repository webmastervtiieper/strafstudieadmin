import { STRAFSTUDIE_ENTITY_TYPE_NAMES } from './entityNames.const';
import { Strafstudie } from '../models/dbModels/Strafstudie.model';
import { StrafstudieBreezemanager } from '../services/strafstudie-breeze-manager.service';
import { BreezeEntityRepository } from '../../core-module/base-classes/breeze-entity-repository';

export class BreezeRepositoryStrafstudie extends BreezeEntityRepository<Strafstudie> {
    constructor(breezemanager: StrafstudieBreezemanager) {
      super('Strafstudies', breezemanager, 'strafstudies', STRAFSTUDIE_ENTITY_TYPE_NAMES.strafstudie, null, true);
    }
}
