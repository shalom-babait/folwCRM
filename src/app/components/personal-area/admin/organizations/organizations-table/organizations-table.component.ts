import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddOrganizationDialogComponent } from '../add-organization-dialog/add-organization-dialog.component';

export interface Organization {
  organization_id: number;
  organization_name: string;
  owner_user_id: number;
  organization_type: 'company' | 'clinic' | 'personal';
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-organizations-table',
  templateUrl: './organizations-table.component.html',
  styleUrls: ['./organizations-table.component.css',
    '../../../../../styles/shared-table.css'
  ]
})
export class OrganizationsTableComponent implements OnInit {
  organizations: Organization[] = [];
  searchTerm: string = '';

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    // כאן יש לטעון את הארגונים מהשרת (להחליף ב-API אמיתי)
    // דמו:
    this.organizations = [
      {
        organization_id: 1,
        organization_name: 'ארגון א',
        owner_user_id: 2,
        organization_type: 'company',
        contact_name: 'דני כהן',
        contact_phone: '050-1234567',
        contact_email: 'dani@example.com',
        status: 'active',
        created_at: '2026-01-01T10:00:00Z',
        updated_at: '2026-01-01T10:00:00Z'
      }
    ];
  }

  get filteredOrganizations(): Organization[] {
    if (!this.searchTerm.trim()) return this.organizations;
    return this.organizations.filter(org =>
      org.organization_name.includes(this.searchTerm)
    );
  }

  openCreateOrganizationDialog(): void {
    const dialogRef = this.dialog.open(AddOrganizationDialogComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadOrganizations();
    });
  }

  editOrganization(org: Organization): void {
    // עריכת ארגון (להוסיף דיאלוג/פונקציונליות)
  }

  deleteOrganization(organization_id: number): void {
    // מחיקת ארגון (להוסיף דיאלוג/פונקציונליות)
  }
}
