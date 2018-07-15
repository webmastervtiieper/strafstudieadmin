import { ViewChild, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { BaseBreezeEntity } from '../../models/breeze.entity';
import { SideFloatOverService } from '../utility-components/side-float-over/side-float-over.service';
import { KeuzeService } from '../../services/utility-services/keuze-service';
import { BreezeEntityRepository } from '../../base-classes/breeze-entity-repository';


export class SidePanelKeuzeLijstBaseComponent<T extends BaseBreezeEntity> implements OnInit, OnDestroy {
    @ViewChild('inputSearchValue') inputSearchValue: Input;
    searchValue: string;
    loading = false;
    keuzes: Array<T> = [];

    filteredKeuzes: Array<T> = [];
    componentDestroyed = new Subject<void>();
    constructor(
        private dataService: BreezeEntityRepository<T>,
        protected sideFloatOverService: SideFloatOverService,
        protected keuzeService: KeuzeService<T>,
        private searchFieldName: string
    ) {}

    ngOnInit() {
        this.dataService.dataIsLoading.subscribe((r) => { this.loading = r; });
        this.dataService.data.takeUntil(this.componentDestroyed).subscribe((v) => {
            this.keuzes = v;
            this.filteredKeuzes = this.keuzes;
        });
        this.keuzes = this.dataService.data.getValue();
        this.filteredKeuzes = this.keuzes;
    }

    btnKeuze_clicked(keuze: T) {
        this.keuzeService.keuze  = keuze;
        this.sideFloatOverService.closePanel();
    }

    filterList() {
        this.filteredKeuzes = this.keuzes.filter((k: T) => {
            const veldwaarde: string = k[this.searchFieldName];
            return veldwaarde.toString().toLowerCase().includes(this.searchValue.toLowerCase(), 0);

        });
    }

    ngOnDestroy() {
        this.componentDestroyed.next(); this.componentDestroyed.complete();
    }
}
