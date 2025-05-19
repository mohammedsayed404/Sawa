import {  UserParams } from './../../core/Models/UserParams';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { IUser } from 'src/app/core/Models/IUser';
import { ToastrService } from 'ngx-toastr';
import { MembersService } from 'src/app/core/services/members.service';

@Component({
  selector: 'app-nav-auth',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './nav-auth.component.html',
  styleUrls: ['./nav-auth.component.scss']
})
export class NavAuthComponent implements OnInit,OnDestroy {
  loginSubscription:Subscription = new Subscription();

  loginForm:FormGroup = this._formBuilder.group({
    username:['',[Validators.required]],
    password:['',[Validators.required]]
  });

  constructor(private _formBuilder:FormBuilder ,
     private _authService:AuthService,private _router:Router
     , private _toastrService:ToastrService, private _membersService:MembersService) { }
  ngOnInit(): void {

  }

  handleLoginForm(loginFormValue:FormGroup):void{
    if(loginFormValue.valid){
      // console.log(loginFormValue.value);
      this.loginSubscription = this._authService.setLogin(loginFormValue.value).subscribe({
        next:(response:IUser)=>{
          console.log(response);
           //just for tessing switch between gender user

           let userParams = new UserParams(response);
           this._membersService.setUserParams(userParams);




          this._router.navigate(['/members']);
        },
        // error:(err)=> this._toastrService.error(err.error)
      })
    }else{
      loginFormValue.markAllAsTouched();
    }
  }



  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }
}
