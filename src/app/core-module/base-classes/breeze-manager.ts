import { Injector } from '@angular/core';
import {
  dictionaryBreezeManagerExceptions,
  BreezeManagerExceptions
} from './exception-dictionaries/breeze-exceptions-dictionaries';

import 'breeze-client/breeze.dataService.webApi';
import 'breeze-client/breeze.modelLibrary.backingStore';
import 'breeze-client/breeze.uriBuilder.json';
import 'breeze-client/breeze.uriBuilder.odata';

import { Observable, Subject } from 'rxjs';
import { AjaxHttpClientAdapter } from 'breeze-bridge2-angular';
import {
  EntityManager,
  MetadataStore,
  DataService,
  DataServiceOptions,
  EntityManagerOptions,
  SaveOptions,
  config
} from 'breeze-client';
import { BaseExceptionService } from './base-exception-service';
import { HttpClient } from '@angular/common/http';


export abstract class BreezeManagerSettings {
  serviceName_Url: string;
  serviceName_Route: string;
}

export abstract class BreezeManager {
  private _em: EntityManager;
  private _metadataStore: MetadataStore;
  private _dataService: DataService;
  private _serviceName_Url: string;
  private _serviceName_Route: string;
  private _serviceName: string;
  private _isMetaDataUpToDate = false;
  private _isInitialized: Subject<boolean> = new Subject<boolean>();
  private exceptionServiceBreezeManager: BaseExceptionService;

  // EXPOSE PRIVATES
  get hasMetaData() {
    return this._metadataStore.hasMetadataFor(
      this._serviceName_Url + this._serviceName_Route
    );
  }

  get entityManager() {
    return this._em;
  }

  get isMetaDataUpToDate() {
    return this._isMetaDataUpToDate;
  }
  // END EXPOSE

  constructor(
    public httpClient: HttpClient,
    private breezeManagerSettings: BreezeManagerSettings
  ) {

    config.registerAdapter(
      'ajax',
      () => new AjaxHttpClientAdapter(this.httpClient)
    );
    config.initializeAdapterInstance(
      'ajax',
      AjaxHttpClientAdapter.adapterName,
      true
    );

    this.exceptionServiceBreezeManager = new BaseExceptionService(
      dictionaryBreezeManagerExceptions,
      BreezeManagerExceptions
    );

    if (breezeManagerSettings) {
      this._serviceName_Url = this.breezeManagerSettings.serviceName_Url;
      this._serviceName_Route = this.breezeManagerSettings.serviceName_Route;
      this._serviceName = this._serviceName_Url + this._serviceName_Route;
      // init the Entitymanager
      const dsConfig: DataServiceOptions = {};
      const emConfig: EntityManagerOptions = {};
      this._metadataStore = new MetadataStore();

      dsConfig.serviceName = this._serviceName;
      this._dataService = new DataService(dsConfig);

      emConfig.dataService = this._dataService;
      emConfig.metadataStore = this._metadataStore;
      emConfig.saveOptions = new SaveOptions({ allowConcurrentSaves: true });

      this._em = new EntityManager(emConfig);
    } else {
      console.error(
        'No breezemanagersettings provided. Breezemanager NOT initialized'
      );
    }
  }


  /**
   * init wordt NIET aangeroepen in de contstructor van de class, maar moet manueel worden aangeroepen in
   * een een component van de applicatie.
   * gebruik subscribe op de Observable 'isInitialized' om te reageren.
   * dan pas kunnen de repositories worden geinitialiseerd. via Init()
   *
   * @param forceMetaDataFromServer
   * @param extraMetaData  : extra metadata van niet database gebonden objecten; vb poco objecten
   */

  init(
    forceMetaDataFromServer = false,
    extraMetaData?: string[]
  ): Promise<null> {
    return new Promise((resolve, reject) => {
      // metadata laden enkel als er nog geen is
      try {
      if (this._metadataStore.isEmpty()) {
      const hasLocalMetaData = localStorage.getItem('MetaData') ? true : false;
      this.checkForConnection() // returns true if connection; false if no connection
        .then(hasConnection => {
          if (!hasLocalMetaData && !hasConnection) {
            // geen connectie naar server en geen breeze Metadata
            reject(
              this.exceptionServiceBreezeManager.getException(
                BreezeManagerExceptions.noConnection
              )
            );
          }
          if (!forceMetaDataFromServer && hasLocalMetaData && !hasConnection) {
            this._metadataStore.importMetadata(localStorage.getItem('MetaData'));
            this._isInitialized.next(true);
            resolve();
          }

          if (hasConnection) {
            // bij voorkeur, als er connectie is haal de data van de server
            this._metadataStore
              .fetchMetadata(this._dataService)
              // this.httpClient.get(this.serviceName + 'Metadata').toPromise()
              .then(() => {
                this._isMetaDataUpToDate = true;
                localStorage.setItem(
                  'MetaData',
                  this._metadataStore.exportMetadata()
                );

                // als er extra metadata moet worden geimporteerd.
                if (extraMetaData) {
                  extraMetaData.forEach(emd => {
                    this._metadataStore.importMetadata(emd, true);
                  });
                }
                this._isInitialized.next(true);
                resolve();
              })
              .catch(err => {
                reject(
                  this.exceptionServiceBreezeManager.getException(
                    BreezeManagerExceptions.onFethBreezeMetaDataFromServer
                  )
                );
              });
          }
        });
      } else {
        resolve();
       }
    } catch (e) {
      console.error(e);
    }
    });
  }

  /**
   * Een afhankelijke breezeRepository kan 'subscriben' en zo ook zijn initialisatie doen.
   */
  isInitialized(): Observable<boolean> {
    return this._isInitialized.asObservable();
  }

  checkForConnection(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const randomNum = Math.round(Math.random() * 10000);
      this.httpClient
        .options(this._serviceName + 'MetaData/?r=' + randomNum)
        .toPromise()
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
  }
}
