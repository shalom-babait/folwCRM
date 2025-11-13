// category-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
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

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog
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
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      direction: 'rtl',
      data: { type: this.selectedType !== 'all' ? this.selectedType : 'prospect' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
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
      if (result) {
        this.loadCategories();
      }
    });
  }

  toggleCategoryStatus(event: Event, category: Category): void {
    event.stopPropagation();
    const newStatus = !category.is_active;
    const action = newStatus ? 'הפעלת' : 'השבתת';
    
    if (confirm(`האם לבצע ${action} של הקטגוריה "${category.category_label}"?`)) {
      this.categoryService.updateCategory(category.category_id, {
        ...category,
        is_active: newStatus
      }).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error toggling category:', error);
          alert('שגיאה בעדכון הקטגוריה');
        }
      });
    }
  }

  deleteCategory(event: Event, category: Category): void {
    event.stopPropagation();
    if (confirm(`האם למחוק את הקטגוריה "${category.category_label}"?\n\nשים לב: הקטגוריה תוסר מכל הרשומות המשוייכות אליה.`)) {
      this.categoryService.deleteCategory(category.category_id).subscribe({
        next: () => {
          this.loadCategories();
          this.selectedCategoryId = null;
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('שגיאה במחיקת הקטגוריה. ייתכן שהיא בשימוש.');
        }
      });
    }
  }
}