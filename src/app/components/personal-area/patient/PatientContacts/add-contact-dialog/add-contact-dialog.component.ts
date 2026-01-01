import { Component } from '@angular/core';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.css']
})
export class AddContactDialogComponent {
  mode: 'existing' | 'new' = 'existing';
  searchTerm = '';
  relationType = '';
  isMainContact = false;

  // New contact fields
  firstName = '';
  lastName = '';
  phone = '';
  email = '';
  isAlsoPatient = false;
  patientStatus = '';

  save() {
    // כאן תבוא הלוגיקה לשמירה
  }
}
