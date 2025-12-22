import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent {
  activity:string="";

  constructor(
    private dialogRef: MatDialogRef<RegistrationFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data:string
  ) {}

  ngOnInit() {
    // Assign the data to the variable
    this.activity = this.data;
    console.log(this.activity);
    // You can perform any other initialization logic here
  }

}
