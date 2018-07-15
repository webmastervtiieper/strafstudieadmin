import { ENTITY_TYPE_NAMES } from './entityNames.const';
import { SmartschoolLeerKracht } from '../models/SmartschoolLeerkracht.model';
import { BreezeEntityRepository } from '../../core-module/base-classes/breeze-entity-repository';
import { SmartschoolBreezemanager } from '../services/smartschool-breeze-manager.service';

export class BreezeRepositorySmartschoolLeerkracht extends BreezeEntityRepository<SmartschoolLeerKracht> {
  constructor(breezeManager: SmartschoolBreezemanager) {
    super('Leerkrachten', breezeManager, 'leerkrachten', ENTITY_TYPE_NAMES.smartschoolLeerkracht, null, true);
  }
}

