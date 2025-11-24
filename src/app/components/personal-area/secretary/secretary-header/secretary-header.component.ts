import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-secretary-header',
  templateUrl: './secretary-header.component.html',
  styleUrls: ['./secretary-header.component.css'
    , '../../../../styles/header.css'
  ]
})
export class SecretaryHeaderComponent implements OnInit {
  selectedSection: string = 'home';
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

  goToSettings() {
    this.showProfileMenu = false;
    this.router.navigate(['/settings']);
  }

  logout() {
    this.showProfileMenu = false;
    localStorage.clear();
    this.router.navigate(['/']);
  }

}