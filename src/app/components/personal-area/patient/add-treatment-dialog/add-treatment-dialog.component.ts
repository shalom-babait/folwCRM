import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-treatment-dialog',
  templateUrl: './add-treatment-dialog.component.html',
  styleUrls: ['./add-treatment-dialog.component.css'],
})
export class CreateTreatmentDialogComponent implements OnInit {
  treatmentForm!: FormGroup;
  places: any[] = []; // כאן נטען את המקומות מה־DB

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.treatmentForm = this.fb.group({
      date: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      place: [null, Validators.required],
      notes: ['']   // שדה חדש להערות
    });
  
    this.places = [
      { id: 1, name: 'מרפאה ראשית' },
      { id: 2, name: 'סניף ירושלים' },
      { id: 3, name: 'סניף תל אביב' }
    ];
  }
  

  save() {
    if (this.treatmentForm.valid) {
      console.log(this.treatmentForm.value);
      // פה תקראי לפונקציה ששולחת לשרת ושומרת ב־DB
    }
  }
  close()
  {
    
  }
}