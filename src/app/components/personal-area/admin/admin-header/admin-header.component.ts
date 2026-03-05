import { Component, OnInit, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css',
    '../../../../styles/header.css']
})
export class AdminHeaderComponent implements OnInit {
  showProfileMenu = false;
  user_name = '';
  userImage = '../../../assets/photoes/LOGO.png'; // תמונת ברירת מחדל

  @Input() selectedSection: string = 'home';
  @Output() sectionChange = new EventEmitter<string>();

  constructor(private router: Router) {}

  showSection(section: string) {
    this.sectionChange.emit(section);
  }

  ngOnInit() {
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    this.user_name =
      (userObj.user?.first_name || '') + ' ' + (userObj.user?.last_name || '') ||
      userObj.user?.user_name ||
      'משתמש';
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

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
    this.router.navigate(['/']);
  }
}