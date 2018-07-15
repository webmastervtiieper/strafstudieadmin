/**
 * HELPER SERVICE om een keuze door te geven van een keuze component naar een aanreoepende component
 */
import { Subject } from 'rxjs';

export class KeuzeService<T> {
  currentValue: T;
  currentReferentie: any;
  keuzeChanged: Subject<{ keuze: T; referentie: any }> = new Subject<{
    keuze: T;
    referentie: any;
  }>();

  constructor() {}

  set keuze(value: T) {
    this.currentValue = value;
    if (value) {
      this.keuzeChanged.next({
        keuze: value,
        referentie: this.currentReferentie
      });
    }
  }
  get keuze() {
    return this.currentValue;
  }

  set referentie(value) {
    this.currentReferentie = value;
  }
}
