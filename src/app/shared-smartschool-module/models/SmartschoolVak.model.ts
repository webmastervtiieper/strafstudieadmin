import { BaseBreezeEntity } from '../../core-module/models/breeze.entity';
/*

import { IStructuralType, DataType, EntityType, NavigationProperty } from 'breeze-client';

export const SmartschoolKlasEntityType : EntityType = {
    namespace:'StrafstudieDataModel',
    shortName: 'SmartschoolVak',
        dataProperties: [
            {nameOnServer:"naam", name:"naam", dataType : DataType.String } ,
            {nameOnServer: "naamKort", name:"naamKort", dataType:DataType.String},
        ]
       }
*/
export class SmartschoolVak extends BaseBreezeEntity {
    naam: string;
    naamKort: string;
    constructor() {
      super();
    }
}

