import { IUser } from './../Models/IUser';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl:string = 'https://localhost:5001/api';
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private _httpclient: HttpClient) { }

  setLogin(formData: FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/login`,formData).pipe(
      map((user:IUser)=>{
        if(user){
          localStorage.setItem("user",JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })


    );
  }


  setRegister(formData:FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/register`,formData).pipe(
      map((user:IUser)=>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUserSource.next(user);
        }
          return user;
      })
    )
  }

  setCurrentUser(user:IUser):void{
    this.currentUserSource.next(user);
  }


  logout():void{
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

}

