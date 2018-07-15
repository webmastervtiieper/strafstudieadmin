import { AppBreezeUnitOfWorkRepository } from './../../../app-unit-of-work-repository';


import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Subject } from 'rxjs';
// import { DataLoaderComponent } from './../loading/loading.component';
import { Component, OnDestroy, Injector } from '@angular/core';
import { takeUntil} from 'rxjs/operators';

import {
  ProgressBarService,
  progressBarMode
} from '../utility-components/progress-bar/progress-bar-service';

import { Errorhandler, applicationError } from '../../services/utility-services/error-handler.service';


@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent  implements OnDestroy, OnInit {
  // als de repositories geinitialiseerd zijn kan de layout worden getoond.Daarom is niet alle data reeds geladen.
  // een repository hoeft niet alle data in het begin te laden voor een correcte werking van de app.
  public dataInitReady = false;

  componentdestroyed = new Subject<void>();

  dataLoaderStatus = [];
  loaderTitle = 'Data Initialisatie';
  fxFlexValue = 0;
  pageTitle = 'Start';

  constructor(
    private errorHandler: Errorhandler,
    private uowRepo: AppBreezeUnitOfWorkRepository,
    private progressBarService: ProgressBarService
  ) {
  }

  ngOnInit() {
    /*this._initObservables();
    this.progressBarService.progressBarMode = progressBarMode.indeterminate;
    this.progressBarService.progressBarShowState  = true;
    this.uowRepo.init()
    .then(() => {
      this.progressBarService.progressBarShowState  = false;
      this.dataInitReady = true;
    });*/

 /*   this._initObservables();
    this._initBreezeData();*/
  }

  ngOnDestroy() {
    this.componentdestroyed.next();
    this.componentdestroyed.complete();
  }

   private _initObservables() {
      this.uowRepo.dataStatusChanged
      .pipe(
          takeUntil(this.uowRepo.dataStatusChanged)
        )
      .subscribe(
        dataInitStatus => {
          // console.log('datainitstatus changed', dataInitStatus.status);
          this.dataLoaderStatus = dataInitStatus.status;
        },
        e => {
          this.errorHandler.handleApplicationError(applicationError.undefined, e);
        },
        () => {
          this.progressBarService.progressBarShowState = false;
          this.dataInitReady = true;
        }
      );
  }

  /**
   * Initialiseer de observables
   */
/*  private _initObservables() {
    this.uow.dataInitStatusChanged
      .takeUntil(this.componentdestroyed)
      .subscribe(() => {}, () => {}, () => {});

      this.uow.dataInitStatusChanged
      .takeUntil(this.uow.dataInitStatusChanged)
      .subscribe(
        dataInitStatus => {
          // console.log('datainitstatus changed', dataInitStatus.status);
          this.dataLoaderStatus = dataInitStatus.status;
        },
        e => {
          this.errorHandler.handleApplicationError(applicationError.undefined, e);
        },
        () => {
          this.progressBarService.progressBarShowState = false;
          this.dataInitReady = true;
        }
      );
  }*/

  /**
   * execute async datacalls en update de DataLoader directive
   */
/*  private _initBreezeData() {
  /*  this.progressBarService.progressBarShowState = true;
    this.progressBarService.progressBarMode = progressBarMode.indeterminate;
*/
    // let dataCallsToExecute: Array<Promise<any>> = [];
    /*this.uow.dataInitStatusChanged
      .takeUntil(this.uow.dataInitStatusChanged)
      .subscribe(
        dataInitStatus => {
          // console.log('datainitstatus changed', dataInitStatus.status);
          this.dataLoaderStatus = dataInitStatus.status;
        },
        e => {
          this.errorHandler.handleApplicationError(applicationError.undefined, e);
        },
        () => {
          this.progressBarService.progressBarShowState = false;
          this.dataInitReady = true;
        }
      );*/
    /*this.uow.allInitialDataLoaded
            .takeUntil(this.componentdestroyed)
            .subscribe(
                () => { },
                () => { },
                () => { this.allDataLoaded = true; }
            );*/
/*    this._initBreezeMetaData()
      .takeUntil(this.uow.dataInitStatusChanged)
      .subscribe(() => {
        this.uow.loadInitialDataInRepositories();
      });
  } */

 /* private _initBreezeMetaData() {
    const metadataFetched: Subject<void> = new Subject();
    // extra metadata ophalen voor smartschool DTO's
    this.uow.metadataRepositorySmartschool
      .fetchMetaData()
      .subscribe((metadata: string) => {
        const extraMetaData = [metadata];
        this.uow.breezeManager
          .init(true, extraMetaData)
          .then(() => {
            metadataFetched.next();
          })
          .catch((error: BreezeManagerExceptions) => {
            metadataFetched.error(error);
            switch (error) {
              case BreezeManagerExceptions.noConnection: {
                this.router.navigate(['/noconnection']);
                return null;
              }
              case BreezeManagerExceptions.onFethBreezeMetaDataFromServer: {
                const ne: NavigationExtras = {};
                ne.queryParams = {
                  errortitle: 'Breeze init',
                  errormessage: 'Geen breeze metadata'
                };
                this.router.navigate(['/error'], ne);
                return null;
              }
            }
          });
      });
    return metadataFetched;
  }*/
}
