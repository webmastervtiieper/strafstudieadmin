import { AppBreezeUnitOfWorkRepository } from './../../../../app-unit-of-work-repository';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { StrafstudieType } from '../../../models/dbModels/StrafstudieType.model';


@Component({
  moduleId: module.id,
  selector: 'strafstudietypes-lijst',
  templateUrl: 'strafstudietypes-lijst.component.html',
  styleUrls: ['strafstudietypes-lijst.component.scss']
})
export class StrafstudietypesLijstComponent implements OnInit {
  strafstudieTypes: StrafstudieType[] = [];

  constructor(private _uowRepo: AppBreezeUnitOfWorkRepository) {}

  ngOnInit() {
    this._uowRepo.strafstudieBreezeUnitOfWork.dsStrafstudieType.all(true).then(r => {
      console.log(r);
      this.strafstudieTypes = r;
    });
  }
}
