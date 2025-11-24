import { Component, OnInit, Output, EventEmitter } from '@angular/core'; // ← הוספתי Output + EventEmitter
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from 'src/app/services/department.service';
import { GroupsService } from 'src/app/services/groups.service';
import { DepartmentWithGroups } from 'src/app/models/department-group.model';
import { AddGroupDialogComponent } from '../add-group-dialog/add-group-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-departments-groups-list',
  templateUrl: './departments-groups-list.component.html',
  styleUrls: ['./departments-groups-list.component.css']
})
export class DepartmentsGroupsListComponent implements OnInit {
  departmentsWithGroups: DepartmentWithGroups[] = [];
  isLoading = false;


  selectGroup(group: any) {
    this.groupSelected.emit(group);
  }
  @Output() groupSelected = new EventEmitter<any>();

  constructor(
    private departmentService: DepartmentService,
    private groupsService: GroupsService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadDepartmentsWithGroups();
  }

  loadDepartmentsWithGroups() {
    this.isLoading = true;
    this.departmentService.getDepartmentsWithGroups()
      .subscribe({
        next: (departments) => {
          this.departmentsWithGroups = departments;
          const allGroups = departments.flatMap(dep => dep.groups || []);

          if (allGroups.length === 0) {
            this.isLoading = false;
            return;
          }

          const requests = allGroups
            .filter(g => g.group_id !== undefined)
            .map(g => this.groupsService.getGroupUsers(g.group_id!));
          forkJoin(requests).subscribe({
            next: (results) => {              
              results.forEach((users, i) => {
                if (users && users.data) {
                  allGroups[i].userCount = users.data.length;
                } else {
                  allGroups[i].userCount = 0;
                }
              });
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error loading users per group', err);
              this.isLoading = false;
            }
          });

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
        this.loadDepartmentsWithGroups();
      }
    });
  }
}
