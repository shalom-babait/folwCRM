import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Organization } from '../../../../../models/organization.model';
import { OrganizationsService } from '../../../../../services/organizations.service';

@Component({
  selector: 'app-add-organization-dialog',
  templateUrl: './add-organization-dialog.component.html',
  styleUrls: ['./add-organization-dialog.component.css',
    '../../../../../styles/dialog-forms.css'
  ]
})
export class AddOrganizationDialogComponent {
  organizationForm: FormGroup;
  isSubmitting = false;
  isEdit: boolean = false;
  organizationData?: Organization;

  constructor(
    public dialogRef: MatDialogRef<AddOrganizationDialogComponent>,
    private fb: FormBuilder,
    private organizationsService: OrganizationsService,
    @Inject(MAT_DIALOG_DATA) public data: { organization?: Organization }
  ) {
    this.isEdit = !!data.organization;
    this.organizationData = data.organization;
    this.organizationForm = this.fb.group({
      name: [this.isEdit ? this.organizationData?.name : '', Validators.required],
      address: [this.isEdit ? this.organizationData?.address : ''],
      phone: [this.isEdit ? this.organizationData?.phone : ''],
      email: [this.isEdit ? this.organizationData?.email : '', Validators.email],
      notes: [this.isEdit ? this.organizationData?.notes : '']
    });
  }

  onSubmit() {
    if (this.organizationForm.invalid) return;
    this.isSubmitting = true;
    const org: Organization = this.organizationForm.value;
    if (this.isEdit && this.organizationData) {
      org.id = this.organizationData.id;
      this.organizationsService.updateOrganization(org).subscribe({
        next: (res: Organization) => this.dialogRef.close(res),
        error: () => this.isSubmitting = false
      });
    } else {
      this.organizationsService.addOrganization(org).subscribe({
        next: (res: Organization) => this.dialogRef.close(res),
        error: () => this.isSubmitting = false
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
