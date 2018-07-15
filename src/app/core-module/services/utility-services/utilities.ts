import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';



@Injectable()
export class Utilities {

  constructor(
    private toastrService: ToastrService
  ) {

  }

  showErrorNotification(titel: string, message: string) {
    this.toastrService.error(message, titel, { });
  }

  objectToArray(obj: Object): Array<any> {
    if (obj) {
      const resultArray = Object.keys(obj).map(function(v, i, a) {
        const r = obj[v];
        return r;
      });
      return resultArray;
    } else {
      console.error('No object to convert!');
    }
  }
}
