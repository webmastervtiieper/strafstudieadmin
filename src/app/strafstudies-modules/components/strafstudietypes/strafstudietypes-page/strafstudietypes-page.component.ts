import { StrafstudieType } from './../../../models/dbModels/StrafstudieType.model';
import { Component, OnInit } from '@angular/core';
import { AppBreezeUnitOfWorkRepository } from '../../../../app-unit-of-work-repository';


@Component({
    moduleId: module.id,
    selector: 'strafstudietypes-page',
    templateUrl: 'strafstudietypes-page.component.html',
    styleUrls: ['strafstudietypes-page.component.scss']
})


export class StrafstudietypesPageComponent implements OnInit {
    pageTitle = 'Strafstudietypes';
    constructor(private _uowRepo: AppBreezeUnitOfWorkRepository) { }

    ngOnInit() { }
  }
