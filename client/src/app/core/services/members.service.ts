
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMember } from '../Models/IMember';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl:string  = environment.apiUrl;

  constructor(private _httpClient:HttpClient) { }




  GetMembers():Observable<IMember[]>{
    return this._httpClient.get<IMember[]>(`${this.baseUrl}/users`);
  }

  GetMemberByUsername(username:string):Observable<IMember>{
    return this._httpClient.get<IMember>(`${this.baseUrl}/users/${username}`);
  }
  GetMemberById(id:number):Observable<IMember>{
    return this._httpClient.get<IMember>(`${this.baseUrl}/users/${id}`);
  }


}
