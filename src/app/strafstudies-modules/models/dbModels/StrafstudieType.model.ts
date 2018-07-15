import { StrafstudieSessie } from './StrafstudieSessie.model';
import { Strafstudie } from './Strafstudie.model';
import { BaseBreezeEntity } from './../../../core-module/models/breeze.entity';

export class StrafstudieType extends BaseBreezeEntity
{
    //Key
    id:string;

    kleur:string; //rgba string
    titel:string;
    dag: string; //naam vd dag, vrijdag, woensdag

    //virtual
    strafstudies: Strafstudie[];
    strafstudieSessies:StrafstudieSessie[];
}