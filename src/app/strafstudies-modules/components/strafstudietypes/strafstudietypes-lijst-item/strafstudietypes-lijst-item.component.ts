import { Component, Input } from '@angular/core';
import { StrafstudieType } from '../../../models/dbModels/StrafstudieType.model';
import { AppBreezeUnitOfWorkRepository } from '../../../../app-unit-of-work-repository';

@Component({
    moduleId: module.id,
    selector: 'strafstudietypes-lijst-item',
    templateUrl: 'strafstudietypes-lijst-item.component.html',
    styleUrls: ['strafstudietypes-lijst-item.component.scss']
})
export class StrafstudietypesLijstItemComponent {
    // tslint:disable-next-line:no-input-rename
    @Input('strafstudieType') strafstudieType: StrafstudieType;
    constructor(private _uowRepo: AppBreezeUnitOfWorkRepository) { }

}



