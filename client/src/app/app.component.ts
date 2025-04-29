import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { IUser } from './core/Models/IUser';
import { HomeComponent } from './views/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private _httpClient: HttpClient , private _authService:AuthService) {}
  ngOnInit(): void {
  //  this.getUsers();
   this.setCurrentUser();
  }
  getUsers():void {
    this._httpClient.get('https://localhost:5001/api/users').subscribe({
      next: response => console.log(response),
      error: (err) => console.log(err),
    });
  }

  setCurrentUser():void{
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user:IUser = JSON.parse(userString);
    this._authService.setCurrentUser(user);

  }
}
