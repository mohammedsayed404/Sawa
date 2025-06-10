import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { IMember } from '../Models/IMember';
import { IMessage } from '../Models/IMessage';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../Models/IPagination';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private readonly baseUrl:string  = environment.apiUrl;

  constructor(private _httpClient:HttpClient) { }


  getMessages(pageNumber:number , pageSize:number , container:string):Observable<PaginatedResult<IMessage[]>>{
    let params = getPaginationHeaders(pageNumber,pageSize).append('container',container);
    return getPaginatedResult<IMessage[]>(`${this.baseUrl}/messages`,params,this._httpClient);
  }

  getMessageThread(username:string):Observable<IMessage[]>{
    return this._httpClient.get<IMessage[]>(`${this.baseUrl}/messages/thread/${username}`);
  }

  sendMessage(username:string,content:string):Observable<any>{
    return this._httpClient.post<IMessage>(`${this.baseUrl}/messages`,{
      recipientUsername:username,
      content
    });
  }

  deleteMessage(messageId:number):Observable<any>{
  return this._httpClient.delete(`${this.baseUrl}/messages/${messageId}`);
}
}
