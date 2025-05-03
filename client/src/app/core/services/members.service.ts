
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMember } from '../Models/IMember';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl:string  = environment.apiUrl;
  members:IMember[] = [];
  constructor(private _httpClient:HttpClient) { }


GetMembers():Observable<IMember[]>{
  if(this.members.length > 0) return of(this.members);
  return this._httpClient.get<IMember[]>(`${this.baseUrl}/users`).pipe(
    tap(members => {
      this.members = members;
    })
  );
}

GetMemberByUsername(username:string):Observable<IMember>{
  const member = this.members.find( m => m.userName === username);
  if(member) return of(member);
  return this._httpClient.get<IMember>(`${this.baseUrl}/users/${username}`);
}
GetMemberById(id:number):Observable<IMember>{
  return this._httpClient.get<IMember>(`${this.baseUrl}/users/${id}`);
}
UpdateMember(member:IMember):Observable<IMember>{
  return this._httpClient.put<IMember>(`${this.baseUrl}/users`, member);
}

}
