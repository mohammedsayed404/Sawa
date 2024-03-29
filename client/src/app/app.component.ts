import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private _اttpClient: HttpClient) {}
  ngOnInit(): void {
    this._اttpClient.get('https://localhost:7114/api/users').subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => console.log(err),
    });
  }
}
