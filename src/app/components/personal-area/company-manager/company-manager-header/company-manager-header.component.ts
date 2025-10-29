import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-manager-header',
  templateUrl: './company-manager-header.component.html',
  styleUrls: ['./company-manager-header.component.css']
})
export class CompanyManagerHeaderComponent {
  showProfileMenu = false;
  userName = 'שם המשתמש'; // יש לשלוף מהשירות
  userImage = '../../../assets/photoes/LOGO.png'; // תמונת ברירת מחדל

  constructor(private router: Router) {}

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
    // לוגיקת התנתקות
    console.log('Logout');
    this.router.navigate(['/']);
  }
  navigateToTherapists() {
    this.router.navigate(['/secretary-dashboard/therapists']);
  }

  navigateToRooms() {
    this.router.navigate(['/secretary-dashboard/rooms']);
  }
}
