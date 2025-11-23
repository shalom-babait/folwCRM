// category-list.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'
    , '../../../../../styles/list-cards.css'
  ]
})

export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  selectedCategoryId: number | null = null;
  selectedType: string = 'all';
  isLoading: boolean = false;

  /**
   * Emits the selected category id for filtering prospects in parent
   */
  @Output() categorySelected = new EventEmitter<number|null>();
  /**
   * When a filter chip is clicked, select the category and emit to parent
   */
filterByCategory(categoryId: number | null) {
  console.log('Filtering by category ID:', categoryId);
  this.selectedCategoryId = categoryId;
  this.categorySelected.emit(categoryId);
}

  filterTypes = [
    { value: 'all', label: 'הכל' },
    { value: 'prospect', label: 'מתעניינים' },
    { value: 'patient', label: 'מטופלים' },
    { value: 'employee', label: 'עובדים' }
    // ניתן להוסיף כאן סוגים נוספים במידת הצורך
  ];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  filterByType(type: string): void {
    this.selectedType = type;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedType === 'all') {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(
        cat => cat.category_type === this.selectedType
      );
    }
    // מיון לפי display_order
    this.filteredCategories.sort((a, b) => a.display_order - b.display_order);
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'all': 'הכל',
      'prospect': 'מתעניינים',
      'patient': 'מטופלים',
      'employee': 'עובדים',
      'treatment': 'טיפולים'
    };
    return labels[type] || type;
  }

  selectCategory(category: Category): void {
    this.selectedCategoryId = category.category_id;
    this.categorySelected.emit(this.selectedCategoryId);
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: { type: this.selectedType !== 'all' ? this.selectedType : 'prospect' }
    });

    dialogRef.afterClosed().subscribe(result => {
      // result will be the created Category (or undefined if cancelled)
      if (result && (result as Category).category_id) {
        const created = result as Category;
        // add locally and reapply filter/sort
        this.categories.unshift(created);
        this.applyFilter();
      }
    });
  }

  editCategory(event: Event, category: Category): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: { category, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      // result will be the updated Category (or undefined if cancelled)
      if (result && (result as Category).category_id) {
        const updated = result as Category;
        const idx = this.categories.findIndex(c => c.category_id === updated.category_id);
        if (idx !== -1) {
          this.categories[idx] = updated;
        } else {
          this.categories.unshift(updated);
        }
        this.applyFilter();
      }
    });
  }

  toggleCategoryStatus(event: Event, category: Category): void {
    event.stopPropagation();
    const newStatus = !category.is_active;
    const action = newStatus ? 'הפעלת' : 'השבתת';
    
    if (confirm(`האם לבצע ${action} של הקטגוריה "${category.category_label}"?`)) {
      const payload = {
        category_type: category.category_type,
        category_name: category.category_name,
        category_label: category.category_label,
        description: category.description,
        color: category.color,
        icon: category.icon,
        display_order: category.display_order,
        is_active: newStatus
      };
      this.categoryService.updateCategory(category.category_id, payload).subscribe({
        next: (updated) => {
          // update locally
          const idx = this.categories.findIndex(c => c.category_id === updated.category_id);
          if (idx !== -1) this.categories[idx] = updated;
          this.applyFilter();
        },
        error: (error) => {
          console.error('Error toggling category:', error);
          this.errorHandler.handleApiError(error);
        }
      });
    }
  }

  deleteCategory(event: Event, category: Category): void {
    event.stopPropagation();
    if (confirm(`האם למחוק את הקטגוריה "${category.category_label}"?\n\nשים לב: הקטגוריה תוסר מכל הרשומות המשוייכות אליה.`)) {
      this.categoryService.deleteCategory(category.category_id).subscribe({
        next: () => {
          // remove locally
          this.categories = this.categories.filter(c => c.category_id !== category.category_id);
          this.applyFilter();
          this.selectedCategoryId = null;
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.errorHandler.handleApiError(error);
        }
      });
    }
  }
}