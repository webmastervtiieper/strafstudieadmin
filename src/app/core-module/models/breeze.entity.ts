
import { EntityType, EntityAspect, Entity } from 'breeze-client'
export class BaseBreezeEntity implements Entity {
    constructor(){}
    entityType: EntityType;
    entityAspect: EntityAspect;
    id:string;
}