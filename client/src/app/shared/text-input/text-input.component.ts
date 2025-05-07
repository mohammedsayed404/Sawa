import { Component, Input, OnInit, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor,  FormControl,  NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements ControlValueAccessor , OnInit {
@Input() label = '';
@Input() type='';



  constructor(@Self() public ngControl:NgControl){
    this.ngControl.valueAccessor = this;

  }
  ngOnInit(): void {
    // this.ngControl.valueAccessor = this; //it's to late
  }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }


  get Control():FormControl {
    return this.ngControl.control as FormControl
  }
}
