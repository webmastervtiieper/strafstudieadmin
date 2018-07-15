import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// intermediar tussen progress-bar component en andere componenten in de app.
export enum progressBarMode {
  indeterminate,
  determinate,
  query,
  buffer
}

@Injectable()
export class ProgressBarService {
  private _showProgressBar = new Subject<boolean>();
  private _progressBarMode = progressBarMode.indeterminate;

  constructor() {}

  progressbarStateChanged() {
    return this._showProgressBar;
  }

  set progressBarMode(value: progressBarMode) {
    this._progressBarMode = value;
  }

  get progressBarMode() {
    let m;
    switch (this._progressBarMode) {
      case progressBarMode.indeterminate: {
        m = 'indeterminate';
        break;
      }
      case progressBarMode.determinate: {
        m = 'determinate';
        break;
      }
      case progressBarMode.query: {
        m = 'query';
        break;
      }
      case progressBarMode.buffer: {
        m = 'buffer';
        break;
      }
    }
    return m;
  }

  /**
   * set to true: show progressbar, set to false: hide progressbar
   */
  set progressBarShowState(value: boolean) {
    this._showProgressBar.next(value);
  }
}
