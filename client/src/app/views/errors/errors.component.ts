import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent {

baseUrl:string = 'https://localhost:5001/api'
validationErro: string[]  = [];

constructor(private _httpClient:HttpClient){}

//not-found
Get404Error():void{
  this._httpClient.get(`${this.baseUrl}/buggy/not-found`).subscribe({
    next:res => console.log(res),
    error:err => console.log(err)
  })
}

//bad-request
Get400Error():void{
  this._httpClient.get(`${this.baseUrl}/buggy/bad-request`).subscribe({
    next:res => console.log(res),
    error:err => console.log(err)
  })
}

//server-error
Get500Error():void{
  this._httpClient.get(`${this.baseUrl}/buggy/server-error`).subscribe({
    next:res => console.log(res),
    error:err => console.log(err)
  })
}

//auth-error
Get401Error():void{
  this._httpClient.get(`${this.baseUrl}/buggy/auth`).subscribe({
    next:res => console.log(res),
    error:err => console.log(err)
  })
}

//Validation-error
Get400ValidationError():void{
  this._httpClient.get(`${this.baseUrl}/buggy/test/One`).subscribe({
    next:res => console.log(res),
    error:err => {
      console.log(err);
      this.validationErro = err;
    }
  })
}

}
