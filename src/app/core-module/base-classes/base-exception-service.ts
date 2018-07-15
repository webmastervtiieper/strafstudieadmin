//  exceptionTypes: wordt gebruikt om nummer te geven aan
export enum enumExceptionMessageType {
  warning,
  error,
  criticalError
}
export interface IException {
  description: string;
  localizedMessages: { [id: string]: string };
  exceptionMessageType?: enumExceptionMessageType;
  name?: string;
  exceptionNumber?: string;
  sourceModulename?: string;
  metaData?: Array<{ key: string; value: string }>;
  message?: string;
  title?: string;
  stack?: string;
  ioinicIconName?: string;
}

export interface IDictionaryExceptions {
  [id: string]: IException;
}

/**base class: cannot instanciate (not newable); is used to create derived classes. */
export class BaseExceptionService {
  protected _language = 'nl';
  protected _titles = {
    error: { nl: 'Fout', fr: 'Erreur', en: 'Error', de: 'Error' },
    criticalError: {
      nl: 'Kritische fout',
      fr: 'Erreur critic',
      en: 'Critical Error',
      de: 'Critical Error'
    },
    warning: {
      nl: 'Waarschuwing',
      fr: 'Attention',
      en: 'Warning',
      de: 'Warning'
    }
  };

  protected _standardException: IException = {
    description: 'unkown exception',
    localizedMessages: {
      nl: 'Ongekende foutmelding, uitzondering niet gespecifieerd',
      en: 'Unkown exception, exception not specified',
      fr: 'Unkown exception, exception not specified'
    },
    name: 'unkown',
    sourceModulename: 'unkown',
    exceptionMessageType: enumExceptionMessageType.error,
    message: '',
    title: ''
  };

  protected _dictionary: IDictionaryExceptions;
  protected _enumExceptionNames;
  constructor(
    dictionary: IDictionaryExceptions,
    enumExceptionNames,
    language?: string
  ) {
    this._dictionary = dictionary;
    this._enumExceptionNames = enumExceptionNames;
    this._language = language || this._language;
    this._setStandardLocalizedMessage();
  }

  private _setStandardLocalizedMessage() {
    this._standardException.message = this._standardException.localizedMessages[
      this._language.toLowerCase()
    ];
  }

  set language(value) {
    this._language = value;
    this._setStandardLocalizedMessage();
  }

  get language() {
    return this._language;
  }

  set dictionary(value: IDictionaryExceptions) {
    this._dictionary = value;
    // Object.assign(this._dictionary, value); // object uitbreiden
    // Object.assign(this._enumNames, enumNames);
  }
  set enumNames(value) {
    this._enumExceptionNames = value;
  }

  getException(exceptionEnumValue?: number) {
    const e: IException =
      (this._dictionary &&
        this._dictionary[this._enumValueToString(exceptionEnumValue)]) ||
      this._standardException;
    e.name = exceptionEnumValue
      ? this._enumValueToString(exceptionEnumValue)
      : 'unkown';
    e.message = this._localizedMessage(exceptionEnumValue);
     // er wordt standaar aangenomen dat het een gewone fout is, tenzij anders aangegeven in het exceptionobject in de dictionary
    e.exceptionMessageType =
      e.exceptionMessageType || enumExceptionMessageType.error;
    e.title = this._localizeTitle(e.exceptionMessageType);
    return e;
  }

  private _localizeTitle(
    exceptionMessageType: enumExceptionMessageType,
    language?: string
  ) {
    const propName = enumExceptionMessageType[exceptionMessageType];
    const t =
      (language && language.toLowerCase()) || this._language.toLowerCase();
    return this._titles[propName][t];
  }

  private _localizedMessage(exceptionEnumValue: number, language?: string) {
    const ex =
      (this._dictionary &&
        this._dictionary[this._enumValueToString(exceptionEnumValue)]) ||
      this._standardException;
    return language
      ? ex.localizedMessages[language.toLowerCase()]
      : ex.localizedMessages[this._language.toLowerCase()];
      // als er een taal wordt opgegevens, geef de vertaling van die taal anders van de standaard taal
  }

  private _enumValueToString(enumValue: number) {
    return this._enumExceptionNames[enumValue];
  }
}
