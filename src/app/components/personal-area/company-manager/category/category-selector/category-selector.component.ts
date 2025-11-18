import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.css']
})
export class CategorySelectorComponent implements OnInit {
  @Input() type: 'prospect' | 'patient' | 'employee' | 'treatment' = 'prospect';
  selectedItems: Category[] = [];
  @Input() initialSelected: Category[] = [];
  @Output() selectionChange = new EventEmitter<Category[]>();

  // internal state similar to department-group-selector
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm = '';
  showDropdown = false;
  isLoading = false;
  searchPlaceholder: string = 'חפש קטגוריות...';
  private clickListener: any;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    // click outside listener to close dropdown
    this.clickListener = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.clickListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.clickListener);
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.category-selector');
    if (!clickedInside && this.showDropdown) {
      this.showDropdown = false;
    }
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategoriesByType(this.type).subscribe({
      next: (res) => {
        this.categories = res.data || [];
        // if initialSelected provided, mark those as selected
        if (this.initialSelected && this.initialSelected.length > 0) {
          const ids = new Set(this.initialSelected.map(c => c.category_id));
          this.selectedItems = this.categories.filter(c => ids.has(c.category_id));
        }
        this.filteredCategories = this.categories.filter(c => !this.isSelected(c));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading = false;
      }
    });
  }

  onSearchFocus(): void {
    this.showDropdown = true;
  }

  onSearchChange(): void {
    this.showDropdown = true;
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCategories = this.categories.filter(c => !this.isSelected(c));
      return;
    }
    this.filteredCategories = this.categories.filter(c =>
      c.category_name.toLowerCase().includes(term) && !this.isSelected(c)
    );
  }

  toggleCategory(cat: Category): void {
    const idx = this.selectedItems.findIndex(c => c.category_id === cat.category_id);
    if (idx > -1) {
      // remove
      this.selectedItems = this.selectedItems.filter(c => c.category_id !== cat.category_id);
    } else {
      // add
      this.selectedItems = [...this.selectedItems, cat];
    }
    // emit a shallow copy to avoid external mutation
    this.selectionChange.emit([...this.selectedItems]);
  }

  isSelected(cat: Category): boolean {
    return this.selectedItems.some(c => c.category_id === cat.category_id);
  }

  clearAll(): void {
    this.selectedItems = [];
    this.selectionChange.emit([]);
  }
}
