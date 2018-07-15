import { TdDialogService } from '@covalent/core';

import { Component, Input,  OnChanges, SimpleChanges } from '@angular/core';

export class DataloaderStatus {
  id: number; title: string; statusText: string; loaded: boolean; hasError: boolean;

}

@Component({
  selector: 'status-visualizer',
  templateUrl: './status-visualizer.component.html',
  styleUrls: ['./status-visualizer.component.scss']
})
export class StatusVizualizerComponent implements OnChanges {
  @Input() loaderTitle = 'Loading data...';
  @Input() hide = false;
  @Input() statusText: Array<DataloaderStatus> = [];
  public mode = 'indeterminate';

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
  }

}
