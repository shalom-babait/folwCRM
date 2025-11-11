import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/services/department.service';
import { DepartmentWithGroups } from 'src/app/models/department-group.model';
import { AddGroupDialogComponent } from '../add-group-dialog/add-group-dialog.component';

@Component({
  selector: 'app-departments-groups-list',
  templateUrl: './departments-groups-list.component.html',
  styleUrls: ['./departments-groups-list.component.css']
})
export class DepartmentsGroupsListComponent implements OnInit {
  departmentsWithGroups: DepartmentWithGroups[] = [];
  isLoading = false;

  constructor(
    private departmentService: DepartmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadDepartmentsWithGroups();
  }

  loadDepartmentsWithGroups() {
    this.isLoading = true;
    this.departmentService.getDepartmentsWithGroups()
      .subscribe({
        next: (departments) => {
          this.departmentsWithGroups = departments;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error loading departments with groups:', error);
        }
      });
  }

  openAddGroupDialog(department: any) {
    const dialogRef = this.dialog.open(AddGroupDialogComponent, {
      width: '400px',
      data: { department }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // רענון הרשימה אחרי הוספה מוצלחת
        this.loadDepartmentsWithGroups();
      }
    });
  }
  openSearchDialog() {
    const dialogRef = this.dialog.open(AddGroupDialogComponent, {
      width: '400px',
      data: {}
    });
}
openAddDepartmentDialog() {
    const dialogRef = this.dialog.open(AddGroupDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // רענון הרשימה אחרי הוספה מוצלחת
        this.loadDepartmentsWithGroups();
      }
    });
  }
}