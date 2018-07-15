import { SmartschoolGroup } from '../models/SmartschoolGroup.model';
import { ENTITY_TYPE_NAMES } from './entityNames.const';
import { BreezeEntityRepository } from '../../core-module/base-classes/breeze-entity-repository';
import { SmartschoolBreezemanager } from '../services/smartschool-breeze-manager.service';

export class BreezeRepositorySmartschoolKlas extends BreezeEntityRepository<SmartschoolGroup> {
    constructor(breezeManager: SmartschoolBreezemanager) {
        super('Klassen', breezeManager, 'klassen', ENTITY_TYPE_NAMES.smartschoolGroup, null, true);
    }
}
