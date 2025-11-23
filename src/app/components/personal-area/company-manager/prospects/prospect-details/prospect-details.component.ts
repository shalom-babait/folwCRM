import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProspectService } from 'src/app/services/prospect.service';
import { CategoryService } from 'src/app/services/category.service';
import { Prospect } from 'src/app/models/Prospect.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-prospect-details',
  templateUrl: './prospect-details.component.html',
  styleUrls: [
    './prospect-details.component.css',
    '../../../../../styles/dialog-forms.css'
  ]
})
export class ProspectDetailsComponent implements OnInit {
  @Input() prospect: Prospect | null = null;
  prospectCategories: Category[] = [];
  isLoading = true;
  availableCategories: Category[] = [];
  private openedViaDialog: boolean = false;

  isEditMode = false;
  editedProspect: Prospect | null = null;
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode && this.prospect) {
      this.editedProspect = { ...this.prospect };
    }
  }

  saveChanges(): void {
    if (this.editedProspect && this.prospect && this.prospect.prospect_id !== undefined) {
      this.isLoading = true;
      // עדכן גם את הקטגוריות שנבחרו
      this.editedProspect.categories = this.prospectCategories;
  this.prospectService.updateProspect(this.prospect.prospect_id, this.editedProspect).subscribe({
        next: (updated: Prospect) => {
          Object.assign(this.prospect!, updated);
          // ודא שהקטגוריות המקומיות מעודכנות
          this.prospectCategories = updated.categories || [];
          this.isEditMode = false;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          alert('שגיאה בעדכון המתעניין. נסה שוב.');
          console.error('Error updating prospect:', err);
        }
      });
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editedProspect = null;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prospectService: ProspectService,
    @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) {
    // אם מגיע prospect מהדיאלוג או מהאינפוט, השתמש בו בלבד ואל תקרא לשרת
    if (dialogData && dialogData.prospect) {
      this.prospect = dialogData.prospect;
      this.isLoading = false;
      this.openedViaDialog = true;
      if (this.prospect && this.prospect.categories && this.prospect.categories.length > 0) {
        this.prospectCategories = this.prospect.categories;
      }
    }
  }

  onCategoriesSelected(categories: Category[]): void {
    // עדכן את הקטגוריות המקומיות וגם את אובייקט העריכה
    this.prospectCategories = categories || [];
    if (this.editedProspect) {
      this.editedProspect.categories = categories || [];
    }
  }

  ngOnInit(): void {
    // אם prospect כבר קיים (מהאינפוט או דיאלוג) אין צורך לקרוא מהשרת
    if (this.openedViaDialog || this.prospect) {
      this.isLoading = false;
      if (this.prospect && this.prospect.categories && this.prospect.categories.length > 0) {
        this.prospectCategories = this.prospect.categories;
      }
      return;
    }

    // אם מגיעים לכאן מניווט ישן (לפי id ב-route) אפשר להציג אזהרה או להוסיף טעינה בעתיד
    const prospectId = this.route.snapshot.params['id'];
    if (prospectId) {
      // לא נטען אוטומטית כדי למנוע כפילות
      console.warn('ProspectDetailsComponent: no local prospect provided and fetching by id is not implemented.');
      this.isLoading = false;
    }
  }
  

  // אין צורך לטעון קטגוריות מהשרת אם הן כבר קיימות ב-prospect
  

  goBack(): void {
    this.router.navigate(['/prospects']);
  }

  // Category-related actions are intentionally omitted here when the component
  // is opened as a dialog with provided prospect data. If you need entity
  // category operations, implement them in `CategoryService` and re-enable.

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      new: 'חדש',
      contacted: 'נוצר קשר',
      converted: 'הומר למטופל',
      not_relevant: 'לא רלוונטי'
    };
    return labels[status] || status;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}