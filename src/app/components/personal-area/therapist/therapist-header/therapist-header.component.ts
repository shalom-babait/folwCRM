import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-therapist-header',
  templateUrl: './therapist-header.component.html',
  styleUrls: ['./therapist-header.component.css']
})
export class TherapistHeaderComponent implements OnInit {
 
showProfileMenu = false;
  userName = ''; 
  userImage = '../../../assets/photoes/LOGO.png'; // תמונת ברירת מחדל

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
  navigateToPatientsList() {
    this.router.navigate(['/personal-area/therapist/patients']);
  }
  goToSettings() {
    this.showProfileMenu = false;
    this.router.navigate(['/settings']);
  }

  logout() {
    this.showProfileMenu = false;
    this.router.navigate(['/']);
  }
}

