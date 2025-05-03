import { Injectable } from '@angular/core';
import {  NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
private _busyRequest:boolean = false;
  constructor(private _ngxSpinnerService: NgxSpinnerService) { }

busy():void{
  this._busyRequest = true;
  this._ngxSpinnerService.show(undefined,{
    type: "line-scale-party",
    bdColor: "rgba(255,255,255,0)",
    color: "#333333",
  })
}

idle():void{
  this._busyRequest = false;
  this._ngxSpinnerService.hide();
}

}
