import { Component, OnInit } from '@angular/core';
import { DepartmentService } from 'src/app/services/department.service';
import { DepartmentWithGroups } from 'src/app/models/department-group.model';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.css']
})
export class DepartmentsListComponent implements OnInit {
  departmentsWithGroups: DepartmentWithGroups[] = [];
  isLoading = false;

  constructor(private departmentService: DepartmentService) {}

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
}