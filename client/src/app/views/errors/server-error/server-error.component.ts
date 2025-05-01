import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit {
  error: any;

  constructor(private _router: Router) {
    const navigation = _router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error'];

    console.log(history.state?.error);

  }
  ngOnInit(): void { //it's too late
  }
}
