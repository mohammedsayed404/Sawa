import { Component, Input, Self } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-picker',
  standalone: true,
  imports: [CommonModule, BsDatepickerModule,ReactiveFormsModule],
  templateUrl: './data-picker.component.html',
  styleUrls: ['./data-picker.component.scss'],
})
export class DataPickerComponent implements ControlValueAccessor {
@Input() label = '';
@Input() maxDate : Date | undefined;
bsConfig:Partial<BsDatepickerConfig> | undefined;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
    this.bsConfig = {
      containerClass:'theme-red',
      dateInputFormat:'DD MM YYYY'
    }
  }
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  get Control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
