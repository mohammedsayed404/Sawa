import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validator, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from "../../shared/text-input/text-input.component";
import { DataPickerComponent } from 'src/app/shared/data-picker/data-picker.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextInputComponent,DataPickerComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

@Output() cancelRegister:EventEmitter<boolean> = new EventEmitter();
maxDate:Date = new Date();
validationErrors:string[] | undefined;


  constructor(private _formBuilder:FormBuilder ,
     private _authService:AuthService,private _router:Router , private _toastrService:ToastrService) { }

ngOnInit(): void {
 this.ReMatch();
 this.maxDate.setFullYear(this.maxDate.getFullYear() - 18) ;
}

  RegisterSubscription:Subscription = new Subscription();

  registerForm:FormGroup = this._formBuilder.group({
    gender:['male',[Validators.required]],
    username:['',[Validators.required]],
    knowAs:['',[Validators.required]],
    dateOfBirth:['',[Validators.required]],
    city:['',[Validators.required]],
    country:['',[Validators.required]],
    password:['',[Validators.required]],
    confirmPassword:['',[Validators.required,this.MatchValues('password')]]
  });

ReMatch():void{
  this.registerForm.controls['password'].valueChanges.subscribe({
    next: _ => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
  })
}


MatchValues(matchTo:string):ValidatorFn{
return (control:AbstractControl) => control.value === control.parent?.get(matchTo)?.value
  ? null : {notMatching:true};
}


Register(registerFormValue:FormGroup):void{
  if(registerFormValue.valid){
    const dob = this.GetDateOnly(registerFormValue.controls['dateOfBirth'].value);
    const values = {...registerFormValue.value,dateOfBirth:dob}
    console.log(values);
    this.RegisterSubscription = this._authService.setRegister(values).subscribe({
      next:(response)=>{
        console.log(response);
        this._router.navigate(['/members']);
      },
      error:(err)=>{
        this.validationErrors = err //will get it back form my interceptor arry error
        this._toastrService.error(err.error)
      }
    })
  }
  else
    registerFormValue.markAllAsTouched();
}


Cancel():void{

  this.cancelRegister.emit(false);
  console.log("Cancelled");

}

private GetDateOnly(dob:string | undefined){
  if(!dob) return;
  const theDob = new Date(dob);
  return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset() )).toISOString().slice(0,10);
}



}
