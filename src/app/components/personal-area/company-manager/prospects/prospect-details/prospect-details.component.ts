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
  styleUrls: ['./prospect-details.component.css']
})
export class ProspectDetailsComponent implements OnInit {
  @Input() prospect: Prospect | null = null;
  prospectCategories: Category[] = [];
  isLoading = true;
  showCategorySelector = false;
  availableCategories: Category[] = [];
  private openedViaDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prospectService: ProspectService,
    private categoryService: CategoryService
    , @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: any
  ) {
    // If prospect data was provided via dialog open, use it and avoid fetching again
    if (dialogData && dialogData.prospect) {
      this.prospect = dialogData.prospect;
      this.isLoading = false;
      this.openedViaDialog = true;
      // load categories assigned to this prospect
      if (this.prospect && this.prospect.prospect_id) {
        this.loadProspectCategories(this.prospect.prospect_id);
      }
    }
  }

  openCategorySelector(): void {
    this.showCategorySelector = true;
  }

  onCategoriesSelected(categories: Category[]): void {
    // Update local categories shown for this prospect. No server sync here.
    this.prospectCategories = categories || [];
    this.showCategorySelector = false;
  }

  ngOnInit(): void {
    // If prospect already provided (e.g. opened as dialog), use it and don't re-fetch.
    if (this.openedViaDialog) {
      return;
    }

    const prospectId = this.route.snapshot.params['id'];
    if (prospectId) {
      // If you navigate here by route, implement fetching in ProspectService.getProspectById
      // For now we don't fetch automatically to avoid duplicate loading when opening as dialog.
      console.warn('ProspectDetailsComponent: no local prospect provided and fetching by id is not implemented.');
      this.isLoading = false;
    }
  }
  
  loadProspectCategories(prospectId: number): void {
    this.categoryService.getCategoriesByEntity('prospect', prospectId).subscribe({
      next: (response) => {
        this.prospectCategories = response.data || [];
      },
      error: (error) => {
        console.error('Error loading categories for prospect:', error);
      }
    });
  }
  

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