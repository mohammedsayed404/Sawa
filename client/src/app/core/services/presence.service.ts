import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { IUser } from '../Models/IUser';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
private readonly hubUrl:string = environment.hubUrl;
private hubConnection?:HubConnection;
private onlineUsersSource = new BehaviorSubject<string[]>([]);
onlineUsers$ = this.onlineUsersSource.asObservable();
  constructor(private _toastrService:ToastrService,private _router:Router) { }


createHubConnection(user:IUser):void{
this.hubConnection = new HubConnectionBuilder()
.withUrl(`${this.hubUrl}/presence`,{
  accessTokenFactory:()=> user.token
})
.withAutomaticReconnect()
.build()
this.hubConnection.start().catch(error => console.log(error));


this.hubConnection.on("UserIsOnline",username =>{
  // this._toastrService.info(`${username} has connected`)
  this.onlineUsers$.pipe(take(1)).subscribe({
    next:users => this.onlineUsersSource.next([...users,username])
  })
})
this.hubConnection.on("UserIsOffline",username =>{
  // this._toastrService.warning(`${username} has disconnected`)
   this.onlineUsers$.pipe(take(1)).subscribe({
    next:users => this.onlineUsersSource.next(users.filter(u => u !== username ))
  })
})
this.hubConnection.on("GetOnlineUsers",usernames =>{
  this.onlineUsersSource.next(usernames);
})

this.hubConnection.on("NewMessageReceived",({username,knownAs})=>{
this._toastrService.info(`${knownAs} has sent you a new message! Click me to see it`)
    .onTap.pipe(take(1)).subscribe({
      // next: _ => this._router.navigateByUrl(`/members/${username}?tab=Messages`)
      next: _ =>   this._router.navigate(['/members', username], { queryParams: { tab: 'Messages' } })

    })
})

}

stopHubConnection():void{
  if(this.hubConnection)
       this.hubConnection.stop().catch(error => console.log(error));
}

}
