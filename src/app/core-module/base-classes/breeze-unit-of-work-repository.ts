import {
  BreezeUnitOfWork,
  DataInitStatus,
  DataStatusChange
} from './breeze-unit-of-work';
import { Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import {
  Errorhandler,
  applicationError
} from '../services/utility-services/error-handler.service';


/**
 * USE: gebruik als singleton voor de hele applicatie; dus geen instances maken,
 * alsook geen extending voor childclasses
 */
@Injectable({
  providedIn: 'root'
})
export class BreezeUnitOfWorkRepository {
  static repositoryUOWWithStatus: Array<{
    breezeUnitOfWork: BreezeUnitOfWork;
    dataLoaderStatus: DataInitStatus[];
  }> =  [];

  private _allMetaDataInitCalls: PromiseLike<void>[] = [];
  private _allDataInitCalls: Promise<void>[] = [];
  // private _ready: Subject<void> = new Subject();
  private _dataReady = false;

  private _dataInitStatusChanged: Subject<{
    status: Array<DataInitStatus>;
    completed: boolean;
  }> = new Subject();


  public get dataReady(): boolean { return this._dataReady; }
  public get dataStatusChanged():  Subject<{ status: Array<DataInitStatus>; completed: boolean; }> {
     return this._dataInitStatusChanged;
    }

  constructor() {}

  add(uow: BreezeUnitOfWork) {
    BreezeUnitOfWorkRepository.repositoryUOWWithStatus.push({
      breezeUnitOfWork: uow,
      dataLoaderStatus: []
    });
  }

  /**
   * Initialiseer de uow's in de repository
   */
  init() {
    // set up subscriptions to dataloader of the uow
    BreezeUnitOfWorkRepository.repositoryUOWWithStatus.forEach(el => {
      this._initObserverUOWDataLoad(el.breezeUnitOfWork);
    });

    return new Promise((resolve, reject) => {
      this._initUOWRepoMetaData()
        .then(() => {
          // pas als alle metadata van alle uow's met success werd gedownload kan de alle andere data worden gedonwload.
          this._initUOWRepoData()
          .then(() => {
            this._dataReady = true;
            this._dataInitStatusChanged.complete();
            resolve();
          })
          .catch((e) => {
            // TO DO implement errorHandler
            reject(e);
          });
        })
        .catch(e => {
          // TO DO implement errorHandler
          reject(e);
        });
    });
  }

  /**
   * init all metadata of all uow's breezemanager in the respository
   */
  private _initUOWRepoMetaData() {
    // initialiseer eerst alle metadata van de breezemanagers in de UOW's
    // als alle METADATA klaar is haal de data van de repositories in UOW's
    return new Promise((resolve, reject) => {
      BreezeUnitOfWorkRepository.repositoryUOWWithStatus.forEach(el => {
        this._allMetaDataInitCalls.push(
          this._initUOWMetaData.call(this, el.breezeUnitOfWork)
        );
      });
      Promise.all(this._allMetaDataInitCalls)
        .then(() => {
          resolve();
        })
        .catch(e => {
          // TO DO implement errorHandler
          reject(e);
        });
    });
  }

  /**
   * Haal de metadata voor de  breezemanager van de UOW.
   * Slechts 1 breezemanager per UOW mogelijk.
   * @param uow
   */
  private _initUOWMetaData(uow: BreezeUnitOfWork) {
    return new Promise<void>((resolve, reject) => {
      uow.breezeManager
        .init(true)
        .then(() => {
          resolve();
        })
        .catch(e => {
          // TO DO implement errorHandler
          console.error(
            'fout bij ophalen van metadata voor breezemanager',
            uow.breezeManager.entityManager.serviceName,
            e
          );
          reject(e);
        });
    });
  }

  private _initUOWRepoData() {
    return new Promise<void>((resolve, reject) => {
      BreezeUnitOfWorkRepository.repositoryUOWWithStatus.forEach(el => {
        this._allDataInitCalls.push(
          el.breezeUnitOfWork.loadInitialDataInRepositories()
        );
      });
      Promise.all(this._allDataInitCalls)
        .then(() => {
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  private _initObserverUOWDataLoad(uow: BreezeUnitOfWork) {
    return new Promise<void>((resolve, reject) => {
      uow.dataInitStatusChanged.pipe(
      takeUntil(uow.dataInitStatusChanged)
    )
      .subscribe(
        (dataInitStatus: DataStatusChange) => {
          this._setStatus(uow, dataInitStatus);
        },
        () => {
          /* Geen ERROR emitted door dataInistatusChanged */
        },
        () => {
          resolve();
        }
      );
    });
  }

  private _setStatus(uow: BreezeUnitOfWork, status: DataStatusChange) {
    this._dataInitStatusChanged.next(status);
    console.log(
      'uow dataload status changed: ',
      uow,
      status.status,
      'complete?: ' + status.completed
    );
    // this.dataLoaderStatus = dataInitStatus.status;
  }
}
