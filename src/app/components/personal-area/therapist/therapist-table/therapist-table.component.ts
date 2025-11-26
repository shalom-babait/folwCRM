import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GroupsService } from 'src/app/services/groups.service';

@Component({
  selector: 'app-therapist-table',
  templateUrl: './therapist-table.component.html',
  styleUrls: ['./therapist-table.component.css']
})
export class TherapistTableComponent implements OnInit, OnChanges {

  @Input() group: any;

  therapists: any[] = [];
  filteredTherapists: any[] = [];
  searchTerm = '';
  isLoading = false;
  gridTemplate = '';

  constructor(private groupsService: GroupsService) {}

  ngOnInit() {
    this.setupGrid();
    this.loadTherapists();
  }

  ngOnChanges() {
    this.loadTherapists();
  }

  setupGrid() {
    const numberOfColumns = 4;
    this.gridTemplate = '2fr 1fr 1fr 1fr';
  }

  loadTherapists() {
    if (!this.group?.group_id) return;

    this.isLoading = true;
    this.therapists = [];
    this.filteredTherapists = [];

    this.groupsService.getTherapistsByGroup(this.group.group_id).subscribe({
      next: (res) => {
        this.therapists = res.data || [];
        this.filteredTherapists = [...this.therapists];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch(term: string) {
    const s = term.toLowerCase();
    this.filteredTherapists = this.therapists.filter(t =>
      (`${t.first_name} ${t.last_name}`.toLowerCase().includes(s))
    );
  }
}
