import { Component, OnInit, Input } from '@angular/core';
import { FollowupService } from 'src/app/services/followup.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowUpWithPerson } from 'src/app/models/followup.model';
import { MatDialog } from '@angular/material/dialog';
import { AddFollowupDialogComponent } from '../add-followup-dialog/add-followup-dialog.component';

@Component({
  selector: 'app-user-follow-up-table',
  templateUrl: './user-follow-up-table.component.html',
  styleUrls: ['./user-follow-up-table.component.css'
    , '../../../../../styles/shared-table.css'
  ]
})

export class UserFollowUpTableComponent implements OnInit {
  @Input() dateFilter: string = 'all';

  isToday(dateStr: string): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();
  }
  followups: FollowUpWithPerson[] = [];
  searchTerm: string = '';
  // dateFilter is now settable via @Input

  constructor(
    private followupService: FollowupService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // If dateFilter is not set by parent, keep 'all' as default
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.followupService.getFollowupsByCreator(userId).subscribe(data => {
        console.log('Follow-ups received in component:', data);
        this.followups = data;
      });
    }
  }
  editFollowup(followup: FollowUpWithPerson): void {
    const dialogRef = this.dialog.open(AddFollowupDialogComponent, {
      width: '400px',
      data: {
        followUp: followup.followUp,
        person: followup.person
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // רענון הרשימה אחרי עריכה
        const userId = this.authService.getCurrentUserId();
        if (userId) {
          this.followupService.getFollowupsByCreator(userId).subscribe(data => {
            this.followups = data;
          });
        }
      }
    });
  }
  updateStatus(f: FollowUpWithPerson): void {
    if (f.followUp?.followup_id && f.followUp.status) {
      this.followupService.updateFollowupStatus(f.followUp.followup_id, f.followUp.status).subscribe();
    }
  }
  deleteFollowup(followup: FollowUpWithPerson): void {
    if (!followup.followUp?.followup_id) return;
    if (confirm('האם אתה בטוח שברצונך למחוק את המעקב?')) {
      this.followupService.deleteFollowup(followup.followUp.followup_id).subscribe({
        next: () => {
          this.followups = this.followups.filter(f => f.followUp.followup_id !== followup.followUp.followup_id);
        },
        error: err => {
          alert('מחיקה נכשלה');
          console.error('Delete followup error:', err);
        }
      });
    }
  }

  get filteredFollowups() {
    let filtered = this.followups;
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter(f =>
        ((f.person?.first_name || '') + ' ' + (f.person?.last_name || '')).toLowerCase().includes(term) ||
        (f.person?.phone || '').includes(term) ||
        (f.followUp?.follow_date || '').includes(term)
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate() + 1);
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    console.log('Current dateFilter:', this.dateFilter);
    if (this.dateFilter === 'today') {
      filtered = filtered.filter(f => {
        const date = new Date(f.followUp?.follow_date);
        console.log('Checking date:', date, 'Today:', new Date());
        return date.toDateString() === today.toDateString();
      });
    } else if (this.dateFilter === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      filtered = filtered.filter(f => {
        const date = new Date(f.followUp?.follow_date);
        return date.toDateString() === tomorrow.toDateString();
      });
    } else if (this.dateFilter === 'thisWeek') {
      filtered = filtered.filter(f => {
        const date = new Date(f.followUp?.follow_date);
        return date >= startOfWeek && date <= endOfWeek;
      });
    } else if (this.dateFilter === 'thisMonth') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      filtered = filtered.filter(f => {
        const date = new Date(f.followUp?.follow_date);
        return date >= startOfMonth && date <= endOfMonth;
      });
    } else if (this.dateFilter === 'nextWeek') {
      filtered = filtered.filter(f => {
        const date = new Date(f.followUp?.follow_date);
        return date >= startOfNextWeek && date <= endOfNextWeek;
      });
    } else if (this.dateFilter === 'nextMonth') {
      filtered = filtered.filter(f => {
        const date = new Date(f.followUp?.follow_date);
        return date >= startOfNextMonth && date <= endOfNextMonth;
      });
    } else if (this.dateFilter === 'overdueOrToday') {
      filtered = filtered.filter(f => {
        const date = new Date(f.followUp?.follow_date);
        date.setHours(0, 0, 0, 0);
        const condition = date <= today && f.followUp.status === 'open';
        console.log('Checking follow-up:', {
          followUpDate: date,
          today: today,
          status: f.followUp.status,
          condition: condition
        });
        return condition;
      });
    }
    console.log('Filtered followups after date filter:', filtered);

    return filtered;
  }
}
