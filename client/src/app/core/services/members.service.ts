import { IUser } from './../Models/IUser';
import { IMember } from './../Models/IMember';
import { UserParams } from './../Models/UserParams';
import { PaginatedResult } from './../Models/IPagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable, of, tap , take } from 'rxjs';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private readonly baseUrl:string  = environment.apiUrl;
  private members:IMember[] = [];
  private membersCache = new Map<string,PaginatedResult<IMember[]>>();
  userParams:UserParams |undefined;
  user:IUser | undefined;

  constructor(private _httpClient:HttpClient, private _authService:AuthService ) {

    //to remember the query after member list desctory
    _authService.currentUser$.pipe(take(1)).subscribe({
          next:(user) => {
                if(user){
                  this.userParams = new UserParams(user);
                  this.user = user;
            }

          }
        })


   }

getUserParams():UserParams  |undefined {
  return this.userParams;
}

setUserParams(params:UserParams):void{
  this.userParams = params;
}

resetUserParams():UserParams  |undefined {
   if(this.user){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  return;
}



GetMembers(userParams:UserParams):Observable<PaginatedResult<IMember[]>>{
  // console.log(Object.values(userParams).join('-'));
  // console.log(this.membersCache.get(responseKey));


  const responseKey = Object.values(userParams).join('-');
  const response = this.membersCache.get(responseKey);
  if(response) return of(response);


  let params = getPaginationHeaders(userParams.pageNumber,userParams.pageSize)
                    .append('minAge',userParams.minAge)
                    .append('maxAge',userParams.maxAge)
                    .append('gender',userParams.gender)
                    .append('orderBy',userParams.orderBy);


  return getPaginatedResult<IMember[]>(`${this.baseUrl}/users`,params,this._httpClient).pipe(
    tap(response => this.membersCache.set(responseKey,response))
  );


  // if(this.members.length > 0) return of(this.members);
  // return this._httpClient.get<IMember[]>(`${this.baseUrl}/users`).pipe(
  //   tap(members => {
  //     this.members = members;
  // })

  // );
}



GetMemberByUsername(username:string):Observable<IMember>{
  // const member = this.members.find( m => m.userName === username);
  // if(member) return of(member);

  const allMembers  = [...this.membersCache.values()].flatMap(r => r.result);

  const member = Array.from(
  new Map(allMembers.map(member => [member?.id, member])).values()
    ).find(member => member?.userName === username);



if(member) return of(member);

  return this._httpClient.get<IMember>(`${this.baseUrl}/users/${username}`);
}

GetMemberById(id:number):Observable<IMember>{
  return this._httpClient.get<IMember>(`${this.baseUrl}/users/${id}`);
}

UpdateMember(member:IMember):Observable<IMember>{
  return this._httpClient.put<IMember>(`${this.baseUrl}/users`, member);
}

SetMainPhoto(photoId:number):Observable<any>{
  return this._httpClient.put(`${this.baseUrl}/users/set-main-photo/${photoId}`,{});
}

DeletePhoto(photoId:number):Observable<any>{
  return this._httpClient.delete(`${this.baseUrl}/users/delete-photo/${photoId}`);
}

AddLike(username:string):Observable<any>{
return this._httpClient.post(`${this.baseUrl}/likes/${username}`,{});
}

GetLikes(predicate:string ,pageNumber:number,PageSize:number  ):Observable<PaginatedResult<IMember[]>>{

  let params = getPaginationHeaders(pageNumber,PageSize)
                    .append('predicate',predicate);

  return getPaginatedResult<IMember[]>(`${this.baseUrl}/likes`,params,this._httpClient);
}




}


