import { Component } from '@angular/core';
import { AppBreezeUnitOfWorkRepository } from '../../../../app-unit-of-work-repository';



@Component({
    moduleId: module.id,
    selector: 'strafstudieaanvragen-page',
    templateUrl: 'strafstudieaanvragen-page.component.html',
    styleUrls: ['strafstudieaanvragen-page.component.scss']
})
export class StrafstudieaanvragenPageComponent {
    pageTitle = '';
    constructor(private _uowRepo: AppBreezeUnitOfWorkRepository) {
    }
}
