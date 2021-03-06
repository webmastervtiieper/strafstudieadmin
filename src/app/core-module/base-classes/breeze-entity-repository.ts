import { Observable, Subject, BehaviorSubject } from 'rxjs';

import {
  /*config,  NamingConvention, DataService, DataType, MetadataStore,
  EntityType, NavigationProperty, DataProperty,*/
  EntityManager,
  EntityQuery,
  Entity,
  EntityType,
  AutoGeneratedKeyType,
  EntityStateSymbol,
  ExportEntitiesOptions,
  FilterQueryOp,
  Predicate
} from 'breeze-client';

//  import { BreezeManager } from '../services/breeze-manager';
//  import { ExceptionServiceBreezeDataService } from '../services/breezeservices-exceptions.service';
//  import { ConnectionService } from './services/connection-service';

import { BreezeManager } from './breeze-manager';


import {
  BaseExceptionService,
  IException
} from './base-exception-service';
import {
  dictionaryBreezeDataServicesExceptions,
  BreezeDataServicesExceptions
} from './exception-dictionaries/breeze-exceptions-dictionaries';
// import { AppInjector } from '../services/appInjector';

export enum SortOrder {
  asc,
  desc
}

// wordt gebruikt om aan de gebruiker te tonen dat de data wordt geladen.
// ==> processLoaders(dataLoaders: Array<ebits.services.IBreezeDataLoaderSetting>, domId?: string)
// base.controller van APP
export interface IBreezeDataLoaderSetting {
  titel: string;
  dataService: BreezeEntityRepository<Entity>;
  forceFromServer?: boolean;
  loadDataOnInit?: boolean;
  isFetchedWithParent?: boolean;
}

export class BreezeDataAutoSaveSettings {
  autoSaveToServer?: boolean;
  autoSaveInterval?: number;
}
export enum QueryType {
  all,
  paged,
  filtered,
  cummulated
}

/**base class: cannot instanciate (not newable); is used to create derived classes.
 * each class can have additional methods, een nieuwe instantie maken is geen best practice
*/
export abstract class BreezeEntityRepository<T extends Entity> /*extends BaseBreezeDataService */ {
  // zet emitData uit zodat bij zoek opdrahten ter controle van een vb bestaande properties
  // de subscriptions niet worden getriggerd. bij 'data.next(result)'
  allowEmitData = true;

  private _entityType: EntityType;
  private exceptionServiceBreezeService: BaseExceptionService;

  private _intervalAttemptSaveToServer;
  // query die wordt gebruikt bij het uitvoeren van de preload actie,
  // actie die een deel van de data laad, om de app te starten, vb deel van eigaars, alle steden, alle pstnummers,...
  private _initialQuery: EntityQuery;
  // private serviceIsReadyValue = false;
  // private serviceIsReadySubject: Subject<boolean> = new Subject<boolean>();

  /**Deprecated; vervagan door dataIsLoading */
  private _dataLoadStarted: Subject<boolean> = new Subject<boolean>();
  private _dataLoadCompleted: Subject<{ hasError: boolean }> = new Subject<{
    hasError: boolean;
  }>();

  public dataIsLoading = new BehaviorSubject<boolean>(false);

  private entityCreated: Subject<T> = new Subject<T>();

  public dataLoadStarted: Observable<boolean>;
  public dataLoadCompleted: Observable<{ hasError: boolean }>;

  public entitiesSaved: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]); // read/write;
  public entitiesRemoved: Subject<T[]> = new Subject<T[]>(); // read/write; // hoeft niet direct een waarde te krijgen.

  public data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  //  public data: Observable<T[]>;

  // public pagedData: T[];

  currentEndRecordCount = 0; //
  queryType: QueryType; // om aan te geven of de dat moet gefilterd worden volgens een zoekstring, een bepaalde query, ....
  allCummulatedDataLoaded = false; // gebruikt bij paging; geeft aan dat alle filtered data werd geladen, dus data == filteredData

  private _totalCountOfRecords = 0;

  set entityType(value) {
    this._entityType = value;
  }
  get entityType() {
    return this._entityType;
  }

  get hasData(): boolean {
    return localStorage.getItem(this._entityTypeName) != null;
  }

  get entityManager(): EntityManager {
    return this.breezeManager.entityManager;
  }

  /*  get data(): Array<T> {
      var _self = this;
      var q = new EntityQuery();
      return <Array<T>>_self.entityManager.executeQueryLocally(q.from(_self._breezeResourcName));
    }*/

  set initialQuery(value: EntityQuery) {
    this._initialQuery = value;
  }
  get initialQuery() {
    return this._initialQuery;
  }
  get totalCountOfRecords() {
    return this._totalCountOfRecords;
  }
  set totalCountOfRecords(value) {
    this._totalCountOfRecords = value;
  }

    /**
     * @param BreezeManager : singleton BreezeManager
     * @param httpService : kan van type Http of AuthHttp zijn
     * @param _breezeResourcName
     * @param _entityTypeName
     * @param _entityKeyType
     * @param _autoSaveSettings
     */

  constructor(
    public friendlyName: string,
    public breezeManager: BreezeManager,
    protected _breezeResourcName: string,
    protected _entityTypeName: string,
    protected _entityMetadata: EntityType = null,
    // om aan te geven of de data van deze repository moet
    // geinitialiseeerd worden bij het initialsiseren van de Unit of Work waartoe de
    public loadDataOnInit = false,
    public calculateTotalamountOfRecordsOnInit = false,
    private _entityKeyType: AutoGeneratedKeyType = AutoGeneratedKeyType.Identity,
    private _autoSaveSettings: BreezeDataAutoSaveSettings = {autoSaveToServer: false, autoSaveInterval: 0}
  ) {
    this.exceptionServiceBreezeService = new BaseExceptionService(
      dictionaryBreezeDataServicesExceptions,
      BreezeDataServicesExceptions
    );
    // registreer de ajax adapter voor breeze
    // gebruik niet de standaard breeze adapter maar wel de authHttp service uit angular-jwt
    // die implementeert een authorizationheader met bearer token

    //  config.registerAdapter('ajax', () => new  AjaxHttpClientAdapter(<any>httpService));
    //  config.initializeAdapterInstance('ajax', AjaxHttpClientAdapter.adapterName, true);

    //   this.savedEntities = this.savedEntities.asObservable();
    //   this.data = this._data.getValue();//  asObservable();

    this._initialQuery = new EntityQuery(this._breezeResourcName);
    this.dataLoadStarted = this._dataLoadStarted.asObservable();
    this.dataLoadCompleted = this._dataLoadCompleted.asObservable();

    // subscrib to datachanges, changes are triggered by queryEntities.
    this.data.subscribe(d => {
      switch (this.queryType) {
        case QueryType.all: {
          //  this.dataForView = d;
          break;
        }
        case QueryType.filtered: {
          //  this.dataForView = d;
          break;
        }
        case QueryType.paged: {
          //  this.pagedData.push(...d); // data die gecummuleerd wordt, vb door scroll down
          break;
        }
        case QueryType.cummulated: {
          break;
        }
      }
    });
  }

  /**
   *
   */
  public init() {
    //  return new Promise((resolve, reject) => {
    // zorgt ervoor dat de KEY automatisch wordt gegenereerd door ENTITYGFRAMEWORK.
    try {
      this.entityType = <EntityType>(
        this.entityManager.metadataStore.getEntityType(this._entityTypeName)
      );
    } catch (e) {
      // als de metadata voor deze entitytype niet aanwezig is
      if (this._entityMetadata) {
        this.entityManager.metadataStore.addEntityType(this._entityMetadata);
        this.entityType = <EntityType>(
          this.entityManager.metadataStore.getEntityType(this._entityTypeName)
        );
      } else {
        console.error(
          'EntityType of the repository can not be set, check the entitytypename: ',
          this._entityTypeName
        );
      }
    }
    const keytype = this._entityKeyType || AutoGeneratedKeyType.Identity;
    this.entityType.setProperties({ autoGeneratedKeyType: keytype }); // AutoGeneratedKeyType.Identity

    if (this._autoSaveSettings && this._autoSaveSettings.autoSaveToServer) {
      const interval = this._autoSaveSettings.autoSaveInterval || 9000000;
      this._intervalAttemptSaveToServer = setInterval(() => {
        const changes = <T[]>(
          this.breezeManager.entityManager.getChanges(this._entityTypeName)
        );
        if (changes.length > 0) { this.saveEntities(changes); }
      }, interval);
    }

    if (this.calculateTotalamountOfRecordsOnInit) {
      this.getTotalAmoutOfRecords();
    }
  }

  public filterOnSearchString(
    zoekString: string,
    fields: string[] = [],
    queryLocally?: boolean
  ) {
    let p: Predicate;

    if (fields.length > 0) {
      fields.forEach(f => {
        if (!p) {
          p = new Predicate(f, FilterQueryOp.Contains, zoekString);
        } else {
          p = p.or(f, FilterQueryOp.Contains, zoekString);
        }
      });
    } else {
      console.warn(
        'filterOnSearchString: No fields are provided, standaard query is being used'
      );
    }
    const q = this.entityQuery().where(p);
    this.queryEntities(q, queryLocally);
  };

  public entityQuery() {
    return new EntityQuery(this._breezeResourcName);
  }

  emitData(results) {
    if (this.allowEmitData) { this.data.next(results); }
  }

  queryEntities(query?: EntityQuery): Promise<Array<T>>;
  // tslint:disable-next-line:unified-signatures
  queryEntities(query?: EntityQuery, queryLocally?: boolean): Promise<Array<T>>;
  queryEntities(
    query?: EntityQuery,
    queryLocally?: boolean
  ): Promise<Array<T>> {
    let initEmitted = false; // slecht 1 keer dataloadstarted.next uitvoeren
    this.dataIsLoading.next(true);
    if (!initEmitted) {
      initEmitted = true;
      this._dataLoadStarted.next(true);
    }
    return new Promise((resolve, reject) => {
      const q = (query || this.initialQuery).toType(this.entityType);
      if (q) {
        // haal eerst zoiezo de data uit de lokale cache
        let localResults;
        try {
          localResults = this.entityManager.executeQueryLocally(q);
        } catch (e) {
          console.error('fout bij lokale query; controleer de query.', e);
        }

        if (!queryLocally) {
          this.entityManager
            .executeQuery(q)
            .then(qr => {
              this.emitData(<T[]>qr.results);
              this.dataIsLoading.next(false);
              this._dataLoadCompleted.complete();
              resolve(<T[]>qr.results);
            })
            .catch(e => {
              console.error(e);
              this._dataLoadCompleted.error(e);
            });
        } else {
          if (
            localResults.length === 0 ||
            (!this.allCummulatedDataLoaded &&
              (this.queryType === QueryType.cummulated ||
                this.queryType === QueryType.filtered))
          ) {
            //  if ((localResults.length == 0) ||
            //  (localResults.length <= this._totalCountOfRecords
            // && this.queryType == QueryType.cummulated) ) {
            // zolang niet alle data is geladen bij een paged query
            this.entityManager
              .executeQuery(q)
              .then(qr => {
                this.dataIsLoading.next(false);
                this.emitData(<T[]>qr.results);
                this._dataLoadCompleted.complete();
                resolve(<T[]>qr.results);
              })
              .catch(e => {
                this._dataLoadCompleted.error(e);
              });
          } else {
            console.warn('werk met localresults');
            this.emitData(<T[]>localResults);
            this.dataIsLoading.next(false);
            this._dataLoadCompleted.complete();
            resolve(<T[]>localResults);
            // .then((r) => {

            // }).catch((e) => { this._dataLoadCompleted.error(e); })
          }
        }
      } else {
        if (queryLocally) {
          console.warn('werk met localresults');

          this.emitData(<T[]>(
            this.entityManager.getEntities(this._entityTypeName)
          ));
          this.dataIsLoading.next(false);
          this._dataLoadCompleted.complete();
          resolve(<T[]>this.entityManager.getEntities(this._entityTypeName));
          // .then((r) => {

          // }).catch((e) => { this._dataLoadCompleted.error(e); })
        }
      }
    });
  }

  byId(value: string): Observable<Array<T>>;
  // tslint:disable-next-line:unified-signatures
  byId(value: string, idFieldName: string): Observable<Array<T>>;
  byId(
    value: string,
    idFieldName: string,
    // tslint:disable-next-line:unified-signatures
    queryLocal: boolean
  ): Observable<Array<T>>;
  byId(
    value?: string,
    idFieldName?: string,
    queryLocal: boolean = true
  ): Observable<Array<T>> {
    return Observable.fromPromise(
      new Promise((resolve, reject) => {
        this.dataIsLoading.next(true);
        const fieldName = idFieldName || 'id';
        console.warn('fieldname', fieldName);
        const q = this.entityQuery()
          .toType(this._entityTypeName)
          .where(fieldName, FilterQueryOp.Equals, value);
        if (!queryLocal) {
          this.entityManager.executeQuery(q).then(qr => {
            this.dataIsLoading.next(false);
            this.emitData(<T[]>qr.results);
            resolve(<T[]>qr.results);
          });
        } else {
          const r = this.entityManager.executeQueryLocally(q);
          this.emitData(<T[]>r);
          this.dataIsLoading.next(false);
          resolve(<T[]>r);
        }
      })
    );
  }

  byFieldName(
    field: string,
    value: Date | number | string,
    queryLocally: boolean = true
  ): Observable<Array<T>> {
    return this.byId(<string>value, field, queryLocally);
  }

  getNext(
    fromStart?: boolean,
    predicate?: Predicate,
    startAmount: number = 25,
    queryLocally = false
  ) {
    if (fromStart) { this.currentEndRecordCount = 0; }
    const c = fromStart ? startAmount : startAmount - 15;
    this.currentEndRecordCount += c;
    let p = predicate && predicate instanceof Predicate ? predicate : null;
    let q = p
      ? this.entityQuery()
          .where(p)
          .skip(0)
          .take(this.currentEndRecordCount)
      : this.entityQuery()
          .skip(0)
          .take(this.currentEndRecordCount);
    this.queryEntities(q, queryLocally).then(r => {
      this.allCummulatedDataLoaded = r.length === this._totalCountOfRecords;
    });
  }

  // CRUD ACTIONS
  createEntity(keyObject?, entityStateSymbol?: EntityStateSymbol): T {
    const e = <T>(
      this.entityManager.createEntity(
        this.entityType,
        keyObject || null,
        entityStateSymbol || null
      )
    );
    this.entityCreated.next(e);
    return e;
    //  this.entityManager.createEntity(this._entityTypeName);
  }

  saveEntity(entity: T): Observable<T[]> {
    return this.saveEntities([entity]);
  }

  saveEntities(entities: Array<T>): Observable<T[]> {
    return Observable.fromPromise(
      new Promise((resolve, reject) => {
        this.dataIsLoading.next(true);
        this.breezeManager
          .checkForConnection()
          .then((hasConnection: boolean) => {
            if (hasConnection) {
              this.entityManager
                .saveChanges(entities)
                .then(result => {
                  this._exportEntities();
                  console.log('savedEntities emitted next', result.entities);
                  this.dataIsLoading.next(false);
                  this.entitiesSaved.next(<T[]>result.entities);
                  this.all(true).then(localBreezeData => {
                    this.emitData(localBreezeData);
                  });
                  resolve(<T[]>result.entities);
                })
                .catch(err => {
                  this.dataIsLoading.next(false);
                  reject(this.exceptionSaveEntiesError);
                });
            } else {
              this._exportEntities();
            }
          });
      })
    );
  }

  removeEntities(entities: T[]) {
    entities.forEach(e => {
      e.entityAspect.setDeleted();
    });
    let p = new Promise((resolve, reject) => {
      this.dataIsLoading.next(true);
      this.entityManager
        .saveChanges(entities)
        .then(result => {
          resolve();
          this.entitiesRemoved.next(<T[]>result.entities);
          entities.forEach(entity => {
            const i = this.data.value.findIndex(d => {
              return d === entity;
            });
            this.data.value.splice(i, 1);
            this.all(true).then(localBreezeData => {
              this.emitData(localBreezeData);
              this.dataIsLoading.next(false);
            });
          });
        })
        .catch(err => {
          this.dataIsLoading.next(true);
          reject(this.exceptionRemoveEntiesError);
        });
    });
    return Observable.fromPromise(p);
  }

  removeEntity(entity: T): Observable<T> {
    const p = new Promise<T>((resolve, reject) => {
      entity.entityAspect.setDeleted();
      this.dataIsLoading.next(true);
      this.entityManager
        .saveChanges([entity])
        .then(result => {
          resolve(<T>result.entities[0]);
          this.entitiesRemoved.next(<T[]>result.entities);
          let i = this.data.value.findIndex(d => {
            return d === result.entities[0];
          });
          this.data.value.splice(i, 1);
          this.all(true).then(localBreezeData => {
            this.emitData(localBreezeData);
            this.dataIsLoading.next(false);
          });
        })
        .catch(err => {
          reject(this.exceptionRemoveEntiesError);
        });
    });
    return Observable.fromPromise<T>(p);
  }

  // END CRUD ACTIONS
  public initData(): Promise<Array<T>>;
  // tslint:disable-next-line:unified-signatures
  public initData(forceFromserver: boolean): Promise<Array<T>>;
  public initData(forceFromserver: boolean = true): Promise<Array<T>> {
    // force from server: standaard true => gebruik zo veel mogelijk up to data info
    return new Promise((resolve, reject) => {
      if (forceFromserver) {
        this.queryEntities()
          .then((entities: Array<T>) => {
            this._exportEntities();
            resolve(entities);
          })
          .catch(e => {
            reject(this.exceptionFetchDataError);
          }); // fout wordt opgevangen in _fetchFromServer method
      } else {
        this._importEntities()
          .then((entities: Array<T>) => {
            resolve(entities);
          })
          .catch(err => {
            this.queryEntities()
              .then((results: Array<T>) => {
                this._exportEntities();
                resolve(results);
              })
              .catch(e => {
                console.error(this.exceptionFetchDataError);
                reject(this.exceptionFetchDataError);
              }); // fout wordt opgevangen in _fetchFromServer method
          });
      }
    });
  }

  public all(queryLocal = false) {
    return this.queryEntities(
      this.entityQuery().toType(this._entityTypeName),
      queryLocal
    );
  }

  private _importEntities(): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      const exportedEntities = localStorage.getItem(this._entityTypeName);
      if (exportedEntities) {
        this.entityManager.importEntities(exportedEntities);
        this._totalCountOfRecords = this.entityManager.getEntities.length;
        resolve(<T[]>this.entityManager.getEntities(this._entityTypeName));
      } else {
        reject(this.exceptionOnImportEnities);
      }
    });
  }
  private _exportEntities() {
    const entitiesToExport = this.entityManager.getEntities(this.entityType);
    this.entityManager.exportEntities(entitiesToExport, true);
    const o: ExportEntitiesOptions = { asString: false, includeMetadata: true };
    const exportedEntities = this.entityManager.exportEntities(
      entitiesToExport,
      o
    );
    localStorage.setItem(this._entityTypeName, exportedEntities);
  }

  private getTotalAmoutOfRecords() {
    const q = this.entityQuery()
      .take(0)
      .inlineCount();
    return this.entityManager.executeQuery(q).then(c => {
      this._totalCountOfRecords = c.inlineCount;
    });
  }

  /**EXCEPTION DEFEINITIONS */
  get exceptionNoConnectionError() {
    const e: IException = this.exceptionServiceBreezeService.getException(
      BreezeDataServicesExceptions.noConnection
    );
    e.sourceModulename = 'breeze dataservice' + this._entityTypeName;
    e.name =
      BreezeDataServicesExceptions[BreezeDataServicesExceptions.noConnection];
    return e;
  }

  get exceptionSaveEntiesError(): IException {
    const e: IException = this.exceptionServiceBreezeService.getException(
      BreezeDataServicesExceptions.onSavingEntityToServer
    );
    e.name =
      BreezeDataServicesExceptions[
        BreezeDataServicesExceptions.onSavingEntityToServer
      ];
    e.sourceModulename = 'breeze dataservice' + this._entityTypeName;
    return e;
  }

  get exceptionFetchDataError(): IException {
    const e: IException = this.exceptionServiceBreezeService.getException(
      BreezeDataServicesExceptions.onFetchBreezeDataFromServer
    );
    e.name =
      BreezeDataServicesExceptions[
        BreezeDataServicesExceptions.onFetchBreezeDataFromServer
      ];
    e.sourceModulename = 'breeze dataservice' + this._entityTypeName;
    return e;
  }

  get exceptionRemoveEntiesError(): IException {
    const e: IException = this.exceptionServiceBreezeService.getException(
      BreezeDataServicesExceptions.onRemovingEntityFromServer
    );
    e.name =
      BreezeDataServicesExceptions[
        BreezeDataServicesExceptions.onRemovingEntityFromServer
      ];
    e.sourceModulename = 'breeze dataservice' + this._entityTypeName;
    return e;
  }
  get exceptionOnImportEnities(): IException {
    const e: IException = this.exceptionServiceBreezeService.getException(
      BreezeDataServicesExceptions.onImportingEntitiesToEntityManager
    );
    e.name =
      BreezeDataServicesExceptions[
        BreezeDataServicesExceptions.onImportingEntitiesToEntityManager
      ];
    e.sourceModulename = 'breeze dataservice' + this._entityTypeName;
    return e;
  }
  /**END EXCEPTION DEFEINITIONS */
}
