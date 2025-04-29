import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [CommonModule, RegisterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode:boolean = false;
  constructor() { }

  ngOnInit() {
  }

  registerToggle():void{
    this.registerMode = !this.registerMode;
  }


  CancelRegisterMode(event:boolean):void{
    this.registerMode = event;

  }

}
