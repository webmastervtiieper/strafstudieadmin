import { STRAFSTUDIE_ENTITY_TYPE_NAMES } from './entityNames.const';
import { StrafstudieType } from '../models/dbModels/StrafstudieType.model';
import { StrafstudieBreezemanager } from '../services/strafstudie-breeze-manager.service';
import { BreezeEntityRepository } from '../../core-module/base-classes/breeze-entity-repository';

export class BreezeRepositoryStrafstudieType extends BreezeEntityRepository<StrafstudieType> {
    constructor(breezeManager: StrafstudieBreezemanager) {
        super('Strafstudie types', breezeManager, 'strafstudietypes', STRAFSTUDIE_ENTITY_TYPE_NAMES.strafstudieType, null, true);
    }
}
