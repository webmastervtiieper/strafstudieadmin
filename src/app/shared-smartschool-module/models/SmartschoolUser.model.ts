

import { BaseBreezeEntity } from '../../core-module/models/breeze.entity';
import { SmartschoolBasisRol } from './SmartschoolBasisrol.enum';
import { SmartschoolGroup } from './SmartschoolGroup.model';

export class  SmartschoolUser extends BaseBreezeEntity
{
     internnummer:string;

     voornaam :string;
     naam :string;
     geslacht :string;
     geboortedatum :string;
     dGeboortedatum :Date;
    rijksregisternummer:string;
    straat:string;
    huisnummer :string;
    busnummer:string;
    postcode:string;
    woonplaats:string;
    land :string;
    emailadres :string;
    basisrol :SmartschoolBasisRol;
    klasnummer:string;

    groups : SmartschoolGroup[];
}

