export interface ILocalizationKeyValuePair {
    vertaling: { [id: string]: string };
}

export interface IDictionaryLocalization {
    [id: string]: ILocalizationKeyValuePair;
}

/**abstract class: cannot instanciate (not newable); is used to create derived classes.
 * not injectable
*/
export abstract class BaseLocalizationService {
    protected _enumNames;
    protected _language: string;
    protected _dictionary: IDictionaryLocalization;
    private _standardDictonary: IDictionaryLocalization =
    {
        standardKey: { vertaling: { nl: '[localized_item]', en: '[localized_item]', fr: '[localized_item]', de: '[localized_item]' } }
    };

    constructor(dictionary: IDictionaryLocalization, enumKeyNames, language?: string) {
        this._dictionary = dictionary;
        this._language = language || 'nl';
        this._enumNames = enumKeyNames;
    }

    set language(value) { this._language = value; }
    get language() { return this._language; }

    set keys(value) { }


    get dictionary() { return this._dictionary; }
    set dictionary(value: IDictionaryLocalization) { this._dictionary = value; }

    localize(enumValue: number);
    localize(enumValue: number, language?: string) {
        const dic = (this._dictionary
          && this._dictionary[this._enumValueToString(enumValue)].vertaling)
          || this._standardDictonary['standardKey'].vertaling;
          // als er een taal wordt opgegevens, geef de vertaling van die taal anders van de standaard taal
        return language ? dic[language.toLowerCase()] : dic[this._language.toLowerCase()];
    }

    private _enumValueToString(enumValue: number) { return this._enumNames[enumValue]; }

}






