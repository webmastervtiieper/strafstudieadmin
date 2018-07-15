import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from './progress-bar-service';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  showProgressBar = true;
  color = 'primary';
  constructor(public progressBarService: ProgressBarService ) { }

  ngOnInit() {
    this.showProgressBar = false;
    this.progressBarService.progressbarStateChanged()
    .subscribe((r) => {
      console.log('progress bar state changed', r);
      this.showProgressBar = r;
    });
  }
}
