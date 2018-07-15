


import { StrafstudieType } from './StrafstudieType.model';
import { BaseBreezeEntity } from '../../../core-module/models/breeze.entity';

import { Data } from '@angular/router/src/config';

import { StrafstudieSessie } from './StrafstudieSessie.model';
import { SmartschoolLeerling } from '../../../shared-smartschool-module/models/SmartschoolLeerling.model';
import { SmartschoolLeerKracht } from '../../../shared-smartschool-module/models/SmartschoolLeerkracht.model';

export class Strafstudie extends BaseBreezeEntity {
    // key
    id: string;
    smartschoolIdLeerling: string;
    smartschoolIdLeerkracht: string;
    strafstudieTypeId: string; // id van het StrafstudieType;
    datumFeit: Date;
    tijdstipBeginStrafstudie: Date;
    tijdstipEindeStrafstudie: Date;
    reden: string;
    opmerking: string;
    aanwezig: boolean;
    taak: string;

    // virtual
    leerling: SmartschoolLeerling;
    leerkracht: SmartschoolLeerKracht;
    strafstudieType: StrafstudieType;
    strafstudieSess: StrafstudieSessie;

    constructor() {
        super();
    }
}
