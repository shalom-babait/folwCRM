import { Component, Input, OnInit } from '@angular/core';
import { GroupsService } from 'src/app/services/groups.service';
import { UserGroup } from 'src/app/models/department-group.model';
@Component({
  selector: 'app-group-therapists',
  templateUrl: './group-therapists.component.html',
  styleUrls: ['./group-therapists.component.css']
})
export class GroupTherapistsComponent implements OnInit {

  @Input() groupId!: number;

  therapists: UserGroup[] = [];
  loading = false;

  constructor(private groupsService: GroupsService) {}

  ngOnInit() {
    if (this.groupId) {
      this.loadTherapists();
    }
  }

  loadTherapists() {
    this.loading = true;
    this.groupsService.getTherapistsByGroup(this.groupId).subscribe({
      next: (res) => {
        this.therapists = res.data || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
