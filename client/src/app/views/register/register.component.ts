import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

@Output() cancelRegister:EventEmitter<boolean> = new EventEmitter();


  constructor(private _formBuilder:FormBuilder ,
     private _authService:AuthService,private _router:Router , private _toastrService:ToastrService) { }

  RegisterSubscription:Subscription = new Subscription();

  registerForm:FormGroup = this._formBuilder.group({
    username:['',[Validators.required]],
    password:['',[Validators.required]]
  });



Register(registerFormValue:FormGroup):void{
  if(registerFormValue.valid){
     console.log(registerFormValue.value);
    this.RegisterSubscription = this._authService.setRegister(registerFormValue.value).subscribe({
      next:(response)=>{
        console.log(response);
        this._router.navigate(['/matches']);
      },
      error:(err)=>this._toastrService.error(err.error)
    })
  }else{
    registerFormValue.markAllAsTouched();
  }
}


Cancel():void{

  this.cancelRegister.emit(false);
  console.log("Cancelled");


}



}
