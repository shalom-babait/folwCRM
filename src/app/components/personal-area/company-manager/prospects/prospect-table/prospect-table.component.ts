// prospect-table.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProspectService } from 'src/app/services/prospect.service';

import { Prospect, ProspectStatus } from 'src/app/models/Prospect.model';

import { AddProspectDialogComponent } from 'src/app/components/personal-area/company-manager/prospects/add-prospect-dialog/add-prospect-dialog.component';

@Component({
  selector: 'app-prospect-table',
  templateUrl: './prospect-table.component.html',
  styleUrls: ['./prospect-table.component.css'
    , '../../../../../styles/shared-table.css'
  ]
})
export class ProspectTableComponent implements OnInit {
  prospects: Prospect[] = [];
  filteredProspects: Prospect[] = [];
  selectedProspectId: number | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;
  sortColumn: string = 'created_at';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private prospectService: ProspectService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProspects();
  }

  loadProspects(): void {
    this.isLoading = true;
    this.prospectService.getAllProspects().subscribe({
      next: (data) => {
        this.prospects = data;
        this.filteredProspects = [...this.prospects];
        this.applySort();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading prospects:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredProspects = [...this.prospects];
    } else {
      this.filteredProspects = this.prospects.filter(prospect => {
        const fullName = `${prospect.first_name} ${prospect.last_name}`.toLowerCase();
        const phone = prospect.phone?.toLowerCase() || '';
        const phoneAlt = prospect.phone_alt?.toLowerCase() || '';
        const city = prospect.city?.toLowerCase() || '';
        const referralSource = prospect.referral_source?.toLowerCase() || '';
        const reasonForVisit = prospect.reason_for_visit?.toLowerCase() || '';
        
        return fullName.includes(term) ||
               phone.includes(term) ||
               phoneAlt.includes(term) ||
               city.includes(term) ||
               referralSource.includes(term) ||
               reasonForVisit.includes(term);
      });
    }
    
    this.applySort();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySort();
  }

  applySort(): void {
    this.filteredProspects.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case 'full_name':
          valueA = `${a.first_name} ${a.last_name}`.toLowerCase();
          valueB = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'phone':
          valueA = a.phone || '';
          valueB = b.phone || '';
          break;
        case 'city':
          valueA = a.city?.toLowerCase() || '';
          valueB = b.city?.toLowerCase() || '';
          break;
        case 'referral_source':
          valueA = a.referral_source?.toLowerCase() || '';
          valueB = b.referral_source?.toLowerCase() || '';
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'created_at':
          valueA = a.created_at ? new Date(a.created_at).getTime() : 0;
          valueB = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  selectProspect(prospect: Prospect): void {
  this.selectedProspectId = prospect.prospect_id ?? null;
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'new': 'חדש',
      'contacted': 'נוצר קשר',
      'converted': 'הומר למטופל',
      'not_relevant': 'לא רלוונטי'
    };
    return statusLabels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  openAddProspectDialog(): void {
    const dialogRef = this.dialog.open(AddProspectDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false,
      direction: 'rtl'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProspects();
      }
    });
  }

  viewProspect(event: Event, prospect: Prospect): void {
    event.stopPropagation();
    // TODO: פתיחת דיאלוג לצפייה בפרטים
    console.log('View prospect:', prospect);
  }

  editProspect(event: Event, prospect: Prospect): void {
    event.stopPropagation();
    // TODO: פתיחת דיאלוג לעריכה
    console.log('Edit prospect:', prospect);
  }

  convertToPatient(event: Event, prospect: Prospect): void {
    event.stopPropagation();
    if (confirm(`האם להמיר את ${prospect.first_name} ${prospect.last_name} למטופל?`)) {
      // TODO: לוגיקת המרה למטופל
      console.log('Convert to patient:', prospect);
    }
  }

  deleteProspect(event: Event, prospect: Prospect): void {
    event.stopPropagation();
    if (confirm(`האם למחוק את ${prospect.first_name} ${prospect.last_name}?`)) {
      if (prospect.prospect_id === undefined) {
        alert('לא ניתן למחוק: מזהה מתעניין חסר');
        return;
      }
      this.prospectService.deleteProspect(prospect.prospect_id).subscribe({
        next: () => {
          this.loadProspects();
        },
        error: (error) => {
          console.error('Error deleting prospect:', error);
          alert('שגיאה במחיקת המתעניין');
        }
      });
    }
  }
}