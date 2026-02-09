import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Organization } from '../../../../../models/organization.model';
import { OrganizationsService } from '../../../../../services/organizations.service';
import { AddOrganizationsComponent } from '../add-organizations/add-organizations.component';

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
  isLoading: boolean = false;

  constructor(private dialog: MatDialog, private organizationsService: OrganizationsService) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.isLoading = true;
    this.organizationsService.getOrganizations().subscribe({
      next: orgs => {
        console.log('ארגונים שהתקבלו מהשרת:', orgs);
  this.organizations = orgs;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get filteredOrganizations(): Organization[] {
    let result: Organization[];
    if (!this.searchTerm.trim()) {
      result = this.organizations;
    } else {
      result = this.organizations.filter(org =>
        org.organization_name.includes(this.searchTerm)
      );
    }
    return result;
  }

  openCreateOrganizationDialog(): void {
    const dialogRef = this.dialog.open(AddOrganizationsComponent, {
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
