import { Component, OnInit } from '@angular/core';
import { FollowupService } from 'src/app/services/followup.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowUpWithPerson } from 'src/app/models/followup.model';

@Component({
  selector: 'app-user-follow-up-table',
  templateUrl: './user-follow-up-table.component.html',
  styleUrls: ['./user-follow-up-table.component.css'
    , '../../../../../styles/shared-table.css'
  ]
})
export class UserFollowUpTableComponent implements OnInit {
  followups: FollowUpWithPerson[] = [];
  searchTerm: string = '';
  dateFilter: string = 'all';

  constructor(private followupService: FollowupService, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.followupService.getFollowupsByCreator(userId).subscribe(data => {
        this.followups = data;
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

    if (this.dateFilter === 'today') {
      filtered = filtered.filter(f => {
        const date = new Date(f.followUp?.follow_date);
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
    }
    return filtered;
  }
}
