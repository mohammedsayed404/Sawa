import { IUser } from './../Models/IUser';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, take, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl:string = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private _httpclient: HttpClient) { }

  setLogin(formData: FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/login`,formData).pipe(
      tap((user:IUser)=>{
        if(user)
          this.setCurrentUser(user);
      })


    );
  }


  setRegister(formData:FormGroup):Observable<IUser>{
    return this._httpclient.post<IUser>(`${this.baseUrl}/account/register`,formData).pipe(
      tap((user:IUser)=>{
        if(user)
          this.setCurrentUser(user);
      })
    )
  }

  setCurrentUser(user:IUser):void{
    localStorage.setItem("user",JSON.stringify(user));
    this.currentUserSource.next(user);
  }


  logout():void{
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

}

