
import { BaseBreezeEntity } from '../../core-module/models/breeze.entity';

import { IStructuralType, DataType, EntityType, NavigationProperty } from 'breeze-client';
import { SmartschoolUser } from './SmartschoolUser.model';

/*
export const SmartschoolGroupEntityType : EntityType = {
    //name:"SmartschoolDataConnector.Models:#SmartschoolGroup",
    namespace:'StrafstudieDataModel',
    shortName: 'SmartschoolGroup',
    dataProperties: [
        {nameOnServer:"int", name:"intnaam", dataType : DataType.String } ,
        {nameOnServer: "code", name:"code", dataType:DataType.String},
        {nameOnServer:"name", name:"name", dataType:DataType.String},
        {nameOnServer:"desc", name:"desc", dataType:DataType.String},
        {nameOnServer:"isKlas", name:"isKlas", dataType:DataType.Boolean},
        {nameOnServer:"isOfficial", name:"isOfficial", dataType:DataType.Boolean}
    ]
    ,
    navigationProperties: [{
        name:"members", isScalar:false, associationName:"group_members", entityType: <EntityType>{name:"SmartschoolUserExtended"}
    }]
}*/

export class SmartschoolGroup extends BaseBreezeEntity
{
     id:string;
     code :string;
     name:string; //groupnaam
     desc:string; //omschrijving
     isKlas:boolean;
     isOfficial: boolean;
     //virtual properties
     members: SmartschoolUser[];
    constructor(){super();}
}

