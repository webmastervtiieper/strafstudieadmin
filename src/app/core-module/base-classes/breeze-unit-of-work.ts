import { Subject } from 'rxjs';
import { Entity } from 'breeze-client';

// Factory van eigenaarservice: nodig om de breezemanater, connetionservice en http service te kunnen injecteren in de BreezeDataService

// import { BreezeManager, BreezeManagerProvider, BreezeManagerSettings } from './core/services/breeze-manager';

// import { BreezeEntityRepository } from './core/base-classes/base-breezeentity-factory';
import { HttpClient } from '@angular/common/http';

import { EntityManager } from 'breeze-client';
import { BreezeManager } from './breeze-manager';
import { BreezeEntityRepository } from './breeze-entity-repository';


// import { BreezeManagerProvider } from './breeze-manager-provider';

class RepositorieEntry {
  id: number;
  repository: BreezeEntityRepository<Entity>;
}

export class DataStatusChange {
  status: Array<DataInitStatus>;
  completed: boolean;
}

export class DataInitStatus {
  id: number;
  title: string;
  statusText: string;
  loaded: boolean;
  hasError: boolean;
}
/**
 * unit of work: bevat alle entity repositories van een module.
 * kan van de hele app, lazyloaded module of feature module zijn
 * elke unit of work heeft zijn eigen BreezeManager; elke BreezeManager heeft zijn eigen EntityManager
 * elke repositor in een UnitOfWork gebruikt dezelfde breezemanager en dus ook dezelfde entity manager
 *
 * De unit of work pattern hoeft gebruikt te worden
 */
export abstract class BreezeUnitOfWork {
  // private _allInitialDataLoaded= new Subject<void>();
  dataReady: boolean;
  private _repositories: Array<RepositorieEntry> = []; // om eventuele bulk
  private _dataInitStatus: Array<DataInitStatus> = [];

  private _dataInitStatusChanged: Subject<DataStatusChange> = new Subject();

  // export datainitstatus to subscribe to and adapt GUI dataload status indicator
  get dataInitStatusChanged() {
    return this._dataInitStatusChanged;
  }
  get breezeManager() {
    return this._breezeManager;
  }



  public get repositories(): Array<RepositorieEntry> {
    return this._repositories;
  }

  /**
   * ABSTRACT Class, geen instance mogeljk
   * @param _breezeManager: de breezemanager die voor deze unit of work wordt gebruikt;
   * 1 breezemanager komt overeen met datamodel;
   * 1 database structuur, dus 1 WEB API Breeze controller;
   */
  constructor(
    // breezeManagerSettings: BreezeManagerSettings,
    private _breezeManager: BreezeManager,
   // private httpService: HttpClient
  ) {
    /*this._breezeManager = breezeManagerProvider.newBreezeManager(
      breezeManagerSettings,
      httpService
    );*/
    // als de metadata klaar is, kunnen de respositories worden geinitialiseerd.
    this._breezeManager.isInitialized().subscribe(() => {
      this._repositories.forEach(r => {
        r.repository.init();
      });
    });
  }

  /**
   * Maak een breeze respository en voeg toe aan repositories van UoW
   * @param friendlyName
   * @param resourceName
   * @param entityTypeName
   * @param initDataOnRepositoryInit
   */
  /*createRepository<T extends Entity>(
    friendlyName: string,
    resourceName: string,
    entityTypeName: string,
    initDataOnRepositoryInit: boolean = true
  ): BreezeEntityRepository<T> {
    const newRepository = new BreezeEntityRepository<T>(
      friendlyName,
      this._breezeManager,
      this.httpService,
      resourceName,
      entityTypeName,
      initDataOnRepositoryInit
    );

    return this.addRepository(newRepository);
  }*/

  /**
   * Voeg een bestaande repository toe.
   * @param repository
   */
  addRepository<T extends Entity>(repository: BreezeEntityRepository<T>) {
    const key = this._repositories.length;
    const repositorieEntry: RepositorieEntry = {
      id: key,
      repository: repository
    };
    /*if (this._repositories.filter((re) => { return re.repository == repository }).length == 0) {
            this._repositories.push(reposirotyEntry);
        }*/
    this._repositories.push(repositorieEntry);
    return repository;
  }

  updateDataInitStatus(id, statusText, complete, hasError) {
    // let f = function(e){return e.id==id};
    const pos = this._dataInitStatus.findIndex(e => {
      return e.id === id;
    });
    const dis = this._dataInitStatus.filter((l, i) => {
      return l.id === id;
    })[0];

    dis.statusText = statusText;
    dis.loaded = complete;
    dis.hasError = hasError;
    if (complete) { this._dataInitStatus.splice(pos, 1, dis); }
  }

  /**
   * Load initial data van de repositories, enkel als de vlag gezet is om dit te doen
   * @param repositories?
   */
  loadInitialDataInRepositories() {
    // const key = 0;
    // const aantalComplete = 0; // aantal reposisitorie waarvan de dataInit complete is.
    return new Promise<void>((resolve, reject) => {
    const promises = [];
    this._dataInitStatus = [];

    this._repositories.forEach(rep => {
      this._dataInitStatusChanged.next({
        status: this._dataInitStatus,
        completed: false
      });

      if (rep.repository.loadDataOnInit) {
        this._dataInitStatus.push(<DataInitStatus>{
          id: rep.id,
          title: rep.repository.friendlyName,
          statusText: 'loading...',
          hasError: false,
          loaded: false
        });
        // key = this._dataInitStatus.length;
        rep.repository.dataLoadCompleted.subscribe(
          d => {
            // Next
            console.log('dataload', d);
          },
          e => {
            // Error
            console.log(e);
            this.updateDataInitStatus(rep.id, 'error loading data', false, true);
            this._dataInitStatusChanged.next({
              status: this._dataInitStatus,
              completed: false
            });
            this._dataInitStatusChanged.error('error loading data');
          },
          () => {
            this.updateDataInitStatus(rep.id, 'Data ready', true, false);
            this._dataInitStatusChanged.next({
              status: this._dataInitStatus,
              completed: true
            });
            // Complete
            console.log('Repository datainit completed', rep.id);
          }
        );

        promises.push(
          rep.repository.initData()
          .then(() => {
            this.updateDataInitStatus(rep.id, 'ready loading data', true, false);
            this.dataInitStatusChanged.next({ status: this._dataInitStatus, completed: true });
          })
          .catch(() => {
            this.updateDataInitStatus(rep.id, 'error on loading', false, true);
            this.dataInitStatusChanged.next({ status: this._dataInitStatus, completed: false });
          })
        );
      }
    });

    Promise.all(promises)
    .then(() => {
      this.dataReady = true;
      console.log('all repositories data init completed');
      this._dataInitStatusChanged.complete();
      resolve();
    })
    .catch((e) => {
      reject(e);
    });

  });
}

  /**
   * Haal de entity repository op naam
   * @param friendlyName
   */
  getByFriendlyName(friendlyName): BreezeEntityRepository<Entity> {
    const r = this._repositories.filter(rep => {
      return rep.repository.friendlyName === friendlyName;
    });
    return r[0].repository || null;
  }
}

export class Factory<T extends Entity> {
  constructor(
    private entityManager: EntityManager,
    private entityTypeName: string
  ) {}

  create() {
    return this.entityManager.createEntity(this.entityTypeName);
  }
}
