import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Organization, OrganizationCreationData } from '../../../../../models/organization.model';
import { Person } from '../../../../../models/person.model';
import { UserData } from '../../../../../models/user.model';
import { OrganizationsService } from '../../../../../services/organizations.service';

@Component({
  selector: 'app-add-organizations',
  templateUrl: './add-organizations.component.html',
  styleUrls: [
    '../../../../../styles/dialog-forms.css',
    './add-organizations.component.css'
  ]
})

export class AddOrganizationsComponent implements OnInit {
  step = 1;
  organizationForm!: FormGroup;
  personForm!: FormGroup;
  userForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private organizationsService: OrganizationsService,
    private dialogRef: MatDialogRef<AddOrganizationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.organizationForm = this.createOrganizationForm();
    this.personForm = this.createPersonForm();
    this.userForm = this.createUserForm();
  }

  createOrganizationForm(): FormGroup {
    return this.fb.group({
      organization_name: ['', Validators.required],
      organization_type: ['', Validators.required],
      status: ['active', Validators.required],
      // owner_user_id יוזן דינאמית אחרי יצירת יוזר
    });
  }

  createPersonForm(): FormGroup {
    return this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      teudat_zehut: [''],
      phone: ['', Validators.required],
      city: [''],
      address: [''],
      birth_date: [''],
      gender: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      user_name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(form: FormGroup, field: string, label: string): string {
    const control = form.get(field);
    if (control?.hasError('required')) return `${label} חובה`;
    if (control?.hasError('email')) return `${label} לא תקין`;
    return '';
  }

  nextStep(): void {
    if (this.step === 1 && this.organizationForm.valid) {
      this.step = 2;
    } else if (this.step === 2 && this.personForm.valid) {
      this.step = 3;
    }
  }

  prevStep(): void {
    if (this.step > 1) this.step--;
  }

  onSave(): void {
    if (this.organizationForm.invalid || this.personForm.invalid || this.userForm.invalid) return;
    this.isSubmitting = true;
    const org: Organization = this.organizationForm.value;
    const person: Person = this.personForm.value;
    const user: UserData = this.userForm.value;
    const creationData: OrganizationCreationData = {
      organization: org,
      person,
      user
    };
    // console.log('נשלח לשרת OrganizationCreationData:', creationData);
    this.organizationsService.addOrganization(creationData).subscribe({
      next: (result: OrganizationCreationData) => {
        this.dialogRef.close(result);
      },
      error: () => this.isSubmitting = false
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
