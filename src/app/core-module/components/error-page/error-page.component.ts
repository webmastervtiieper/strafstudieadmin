import { Component, OnInit, Injector } from '@angular/core';
import { Errorhandler } from '../../services/utility-services/error-handler.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  title: string;
  description: string;
  stackTrace: string;

  constructor(
    private errorHandler: Errorhandler,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    /*const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('errorCode')) {
      // tslint:disable-next-line:radix
      const errorCode = parseInt(urlParams.get('errorCode'));
      this.description = this.errorHandler.getErrorDescription(errorCode);
      this.title = this.errorHandler.getErrorTitel(errorCode);
    }*/

    if (this.activatedRoute.snapshot.paramMap.has('errorCode')) {
      // tslint:disable-next-line:radix
      const errorCode = parseInt(this.activatedRoute.snapshot.paramMap.get('errorCode'));
      this.description = this.errorHandler.getErrorDescription(errorCode);
      this.title = this.errorHandler.getErrorTitel(errorCode);
      }
  }
}
