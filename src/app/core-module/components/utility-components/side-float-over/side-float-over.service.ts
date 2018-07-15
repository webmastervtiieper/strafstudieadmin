import {
  Injectable,
  EventEmitter,
  Component,
  ViewContainerRef
} from '@angular/core';

import { Observable, Subject } from 'rxjs';

/**
 * intermediar tussen component side-float-component en de componenten die gebruik maken van het side-float-component
 */
@Injectable()
export class SideFloatOverService {
  keuze: any; // voor gebruik om een keuze te transporteren van een keuzelijst naar een aanroepend component waar de keuze wordt gebruikt

  openPanelRequested: Subject<null> = new Subject();
  closePanelRequested: Subject<null> = new Subject();
  panelOpened: Subject<ViewContainerRef> = new Subject();
  panelClosed: Subject<ViewContainerRef> = new Subject();
  constructor() {}

  /**
   *return value ViewContainer: de container in het side float panel waar de component kan worden geinjecteerd
   */
  openPanel(componentToInject?): Observable<ViewContainerRef> {
    this.openPanelRequested.next(componentToInject);
    return this.panelOpened.asObservable();
  }

  closePanel() {
    this.closePanelRequested.next();
  }
}
