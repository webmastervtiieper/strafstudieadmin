/**Exceptionservice voor breeze/dataservices */

import { IDictionaryExceptions } from '../base-exception-service';

export enum BreezeManagerExceptions {
  noConnection,
  onFethBreezeMetaDataFromServer,
  noServiceRoute,
  noServiceUrl
}
export let dictionaryBreezeManagerExceptions: IDictionaryExceptions = {
  noConnection: {
    title: 'Connection',
    ioinicIconName: 'md-wifi',
    description: 'no internet connection',
    localizedMessages: {
      nl:
        'Kan geen connectie maken met de server, controleer de internet verbinding.',
      en: '',
      fr: ''
    }
  },
  onFethBreezeMetaDataFromServer: {
    title: 'Breeze metadata',
    description: 'error on fetching breeze metadata',
    localizedMessages: {
      nl: 'Fout bij het ophalen van Breeze Metadata van de server.',
      en: '',
      fr: ''
    }
  },
  noServiceName: {
    title: 'Breeze servicename',
    description: 'No serviceName defined in breeze enitity manager.',
    localizedMessages: {
      nl: 'Er is geen breeze service url gedefinieerd',
      en: '',
      fr: ''
    }
  }
};

/**Exceptionservice voor breeze/dataservices */
export enum BreezeDataServicesExceptions {
  noConnection,
  noMetadata,
  onFetchBreezeDataFromServer,
  onSavingEntityToServer,
  onRemovingEntityFromServer,
  onImportingEntitiesToEntityManager
}
export let dictionaryBreezeDataServicesExceptions: IDictionaryExceptions = {
  noConnection: {
    title: 'Internet connection',
    description: 'no internet connection',
    localizedMessages: {
      nl:
        'Kan geen connectie maken met de server, controleer de internet verbinding.',
      en: '',
      fr: ''
    }
  },
  noMetadata: {
    title: 'Breeze metadata',
    description: 'no breeze metadata available',
    localizedMessages: {
      nl: 'De Breeze entity manager beschikt niet over de nodige metadata.',
      en: '',
      fr: ''
    }
  },
  onFetchBreezeDataFromServer: {
    title: 'Breeze entities fetch',
    description: 'error on fetching breeze data enities from server',
    localizedMessages: {
      nl: 'Fout bij het ophalen van data van de server.',
      en: '',
      fr: ''
    }
  },
  onSavingEntityToServer: {
    title: 'Breeze entities save',
    description: 'error on saving breeze data enities to server',
    localizedMessages: {
      nl: 'Fout bij het bewaren van data naar de server.',
      en: '',
      fr: ''
    }
  },
  onRemovingEntityFromServer: {
    title: 'Breeze entities remove',
    description: 'error on removing breeze data enities to server',
    localizedMessages: {
      nl: 'Fout bij het verwijderen van data van de server.',
      en: '',
      fr: ''
    }
  },
  onImportingEntitiesToEntityManager: {
    title: 'Breeze entities import',
    description: 'error on importing breeze enities from local storage',
    localizedMessages: {
      nl: 'Fout bij het importeren van locale data.',
      en: '',
      fr: ''
    }
  }
};
