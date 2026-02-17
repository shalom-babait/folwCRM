import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FollowupService } from 'src/app/services/followup.service';
import { FollowUp } from 'src/app/models/followup.model';
import { AddFollowupDialogComponent } from '../add-followup-dialog/add-followup-dialog.component';

@Component({
  selector: 'app-followup-table',
  templateUrl: './followup-table.component.html',
  styleUrls: ['./followup-table.component.css'
    , '../../../../../styles/shared-table.css'
  ]
})
export class FollowupTableComponent implements OnInit {

  @Input() personId!: number;
  @Input() creatorId!: number;

  followups: FollowUp[] = [];
  searchTerm: string = '';

  constructor(
    private followupService: FollowupService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // console.log('Creator ID (ngOnInit):', this.creatorId);
    if (typeof this.creatorId === 'undefined') {
      console.warn('Creator ID is undefined!');
    }
    if (this.personId) {
      this.loadFollowups();
    }
  }

  loadFollowups(): void {
    this.followupService.getFollowupsByPerson(this.personId).subscribe((data: FollowUp[]) => {
      this.followups = data;
    });
  }

  get filteredFollowups(): FollowUp[] {
    if (!this.searchTerm.trim()) return this.followups;
    return this.followups.filter(f =>
      f.follow_date.includes(this.searchTerm)
    );
  }

  openCreateFollowupDialog(): void {
    const dialogRef = this.dialog.open(AddFollowupDialogComponent, {
      width: '450px',
      direction: 'rtl',
      data: { person_id: this.personId, created_by_user_id: this.creatorId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadFollowups();
    });
  }

  editFollowup(f: FollowUp): void {
    const dialogRef = this.dialog.open(AddFollowupDialogComponent, {
      width: '450px',
      direction: 'rtl',
      data: { followUp: f }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadFollowups();
    });
  }

  toggleReminder(f: FollowUp): void {
    if (typeof f.followup_id === 'number') {
      this.followupService.updateFollowupReminder(f.followup_id, f.remind)
        .subscribe();
    }
  }

  deleteFollowup(id: number): void {
    this.followupService.deleteFollowup(id).subscribe(() => {
      this.followups = this.followups.filter(x => x.followup_id !== id);
    });
  }

  updateStatus(f: FollowUp): void {
    if (typeof f.followup_id === 'number' && f.status) {
      this.followupService.updateFollowupStatus(f.followup_id, f.status).subscribe();
    }
  }
  selectedIds = new Set<number>();

  toggleSelection(id: number | undefined): void {
    if (id == null) return;
    this.selectedIds.has(id)
      ? this.selectedIds.delete(id)
      : this.selectedIds.add(id);
  }

  isSelected(id: number | undefined): boolean {
    return id != null && this.selectedIds.has(id);
  }

}
