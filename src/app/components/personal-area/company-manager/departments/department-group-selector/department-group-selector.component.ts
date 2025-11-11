// department-selector.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Department, Group, DepartmentWithGroups, SelectedItem } from 'src/app/models/department-group.model';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department-group-selector',
  templateUrl: './department-group-selector.component.html',
  styleUrls: ['./department-group-selector.component.css']
})
export class DepartmentGroupSelectorComponent implements OnInit, OnDestroy {
  // קלט - מחלקות שכבר נבחרו (לעריכה)
  @Input() initialSelections: SelectedItem[] = [];
  
  // קלט - טקסט placeholder לחיפוש
  @Input() searchPlaceholder: string = 'חפש מחלקה או קבוצה להוספה...';
  
  // פלט - שינויים בבחירות
  @Output() selectionsChanged = new EventEmitter<SelectedItem[]>();

  // מצב פנימי
  departments: DepartmentWithGroups[] = [];
  selectedItems: SelectedItem[] = [];
  searchTerm: string = '';
  showDropdown: boolean = false;
  isLoading: boolean = false;
  expandedDepartmentId: number | null = null;
  private clickListener: any;

  constructor(private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.loadDepartments();
    
    // טעינת בחירות התחלתיות אם קיימות
    if (this.initialSelections && this.initialSelections.length > 0) {
      this.selectedItems = [...this.initialSelections];
    }

    // הוספת מאזין ללחיצה מחוץ לקומפוננטה
    this.clickListener = this.onDocumentClick.bind(this);
    document.addEventListener('click', this.clickListener);
  }

  ngOnDestroy(): void {
    // הסרת המאזין
    document.removeEventListener('click', this.clickListener);
  }

  // טיפול בלחיצה מחוץ לקומפוננטה
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.department-selector');
    
    if (!clickedInside && this.showDropdown) {
      this.showDropdown = false;
      this.expandedDepartmentId = null;
    }
  }

  // טעינת מחלקות מהשרת
  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartmentsWithGroups().subscribe({
      next: (data) => {
        this.departments = data;
        this.isLoading = false;
        console.log('Departments loaded:', data);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.isLoading = false;
      }
    });
  }

  // פילטור מחלקות לפי חיפוש
  get filteredDepartments(): DepartmentWithGroups[] {
    if (!this.searchTerm.trim()) {
      // אם אין טקסט חיפוש, החזר את כל המחלקות שעוד לא נבחרו במלואן
      return this.departments.filter(dept => !this.isDepartmentFullySelected(dept.department));
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    
    return this.departments.filter(dept => {
      // סינון לפי שם מחלקה
      const deptMatch = dept.department.department_name.toLowerCase().includes(searchLower);
      
      // סינון לפי שם קבוצה
      const groupMatch = dept.groups.some(group => 
        group.group_name.toLowerCase().includes(searchLower)
      );
      
      // הצג מחלקה אם היא תואמת או אם יש לה קבוצות תואמות
      return (deptMatch || groupMatch) && !this.isDepartmentFullySelected(dept.department);
    });
  }

  // קבלת קבוצות מסוננות למחלקה
  getFilteredGroupsForDepartment(dept: DepartmentWithGroups): Group[] {
    if (!this.searchTerm.trim()) {
      // אם אין טקסט חיפוש, החזר רק קבוצות שעוד לא נבחרו
      return dept.groups.filter(group => 
        !this.isItemSelected('group', dept.department, group)
      );
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    
    // אם יש טקסט חיפוש, החזר קבוצות שתואמות ועוד לא נבחרו
    return dept.groups.filter(group => 
      group.group_name.toLowerCase().includes(searchLower) &&
      !this.isItemSelected('group', dept.department, group)
    );
  }

  // בדיקה אם מחלקה נבחרה במלואה (כמחלקה או כל הקבוצות)
  isDepartmentFullySelected(department: Department): boolean {
    const deptWithGroups = this.departments.find(d => d.department.department_id === department.department_id);
    if (!deptWithGroups) return false;

    // בדיקה אם המחלקה נבחרה כמחלקה שלמה
    const isDeptSelected = this.selectedItems.some(
      item => item.type === 'department' && 
              item.department.department_id === department.department_id
    );

    if (isDeptSelected) return true;

    // בדיקה אם כל הקבוצות נבחרו
    if (deptWithGroups.groups.length === 0) return false;
    
    const selectedGroupsCount = this.selectedItems.filter(
      item => item.type === 'group' && 
              item.department.department_id === department.department_id
    ).length;

    return selectedGroupsCount === deptWithGroups.groups.length;
  }

  // בדיקה אם פריט נבחר
  isItemSelected(type: 'department' | 'group', department: Department, group?: Group): boolean {
    return this.selectedItems.some(item => {
      if (type === 'department') {
        return item.type === 'department' && 
               item.department.department_id === department.department_id;
      } else {
        return item.type === 'group' && 
               item.department.department_id === department.department_id &&
               item.group?.group_id === group?.group_id;
      }
    });
  }

  // פתיחה/סגירה של מחלקה
  toggleDepartment(departmentId: number): void {
    if (this.expandedDepartmentId === departmentId) {
      this.expandedDepartmentId = null;
    } else {
      this.expandedDepartmentId = departmentId;
    }
  }

  // בדיקה אם מחלקה פתוחה
  isDepartmentExpanded(departmentId: number): boolean {
    return this.expandedDepartmentId === departmentId;
  }

  // בחירת מחלקה שלמה
  selectWholeDepartment(dept: DepartmentWithGroups): void {
    // הסרת כל הקבוצות של המחלקה הזו
    this.selectedItems = this.selectedItems.filter(
      item => item.department.department_id !== dept.department.department_id
    );
    
    // הוספת המחלקה השלמה
    this.selectedItems.push({
      type: 'department',
      department: dept.department
    });

    // סגירת הדרופדאון והאיפוס
    this.showDropdown = false;
    this.expandedDepartmentId = null;
    this.searchTerm = '';
    this.emitChanges();
  }

  // בחירת קבוצה
  selectGroup(dept: DepartmentWithGroups, group: Group): void {
    // הסרת המחלקה השלמה אם קיימת
    this.selectedItems = this.selectedItems.filter(
      item => !(item.type === 'department' && 
                item.department.department_id === dept.department.department_id)
    );

    // הוספת הקבוצה
    this.selectedItems.push({
      type: 'group',
      department: dept.department,
      group: group
    });

    // סגירת הדרופדאון והאיפוס
    this.showDropdown = false;
    this.expandedDepartmentId = null;
    this.searchTerm = '';
    this.emitChanges();
  }

  // הסרת פריט
  removeItem(index: number): void {
    this.selectedItems.splice(index, 1);
    this.emitChanges();
  }

  // איפוס כל הבחירות
  clearAll(): void {
    this.selectedItems = [];
    this.expandedDepartmentId = null;
    this.emitChanges();
  }

  // שליחת שינויים להורה
  private emitChanges(): void {
    this.selectionsChanged.emit([...this.selectedItems]);
  }

  // פתיחת dropdown
  onSearchFocus(): void {
    this.showDropdown = true;
    this.expandedDepartmentId = null;
  }

  // סגירת dropdown
  onSearchBlur(): void {
    // לא סוגרים את הדרופדאון אוטומטית
    // הוא ייסגר רק אם לוחצים מחוץ לאזור הקומפוננטה
  }

  // עדכון טקסט החיפוש
  onSearchChange(): void {
    this.showDropdown = true;
    this.expandedDepartmentId = null;
  }
}