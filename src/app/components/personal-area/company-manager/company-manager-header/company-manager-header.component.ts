import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-company-manager-header',
    templateUrl: './company-manager-header.component.html',
    styleUrls: ['./company-manager-header.component.css', '../../../../styles/header.css']
  })
  export class CompanyManagerHeaderComponent implements OnInit {
    showProfileMenu = false;
    userName = '';
    userImage = '../../../assets/photoes/LOGO.png'; // תמונת ברירת מחדל

    selectedSection: string | null = null;

    showSection(section: string) {
      this.selectedSection = this.selectedSection === section ? null : section;
    }

    constructor(private router: Router) {}
    ngOnInit() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userName = user.first_name + ' ' + user.last_name || 'משתמש';
    }
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    }

    // סגירת התפריט בלחיצה מחוץ לאזור
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const profileContainer = target.closest('.user-profile-container');
      if (!profileContainer && this.showProfileMenu) {
        this.showProfileMenu = false;
      }
    }

    goToSettings() {
      this.showProfileMenu = false;
      this.router.navigate(['/settings']);
    }

    logout() {
      this.showProfileMenu = false;
      console.log('Logout');
      this.router.navigate(['/']);
    }
    navigateToTherapists() {
      this.router.navigate(['/secretary-dashboard/therapists']);
    }

    navigateToRooms() {
      this.router.navigate(['/secretary-dashboard/rooms']);
    }

    // תקשורת עם ההורה
    @Output() showDepartments = new EventEmitter<void>();

    navigateToDepartments() {
      this.showDepartments.emit();
  }
}
