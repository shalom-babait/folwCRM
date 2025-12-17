import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TherapistSessionService } from 'src/app/services/therapist-session.service';

@Component({
  selector: 'app-therapist-header',
  templateUrl: './therapist-header.component.html',
  styleUrls: ['./therapist-header.component.css', '../../../../styles/header.css']
})
export class TherapistHeaderComponent implements OnInit {
  selectedSection: string = 'home';
  showProfileMenu = false;
  user_name = '';
  userImage = '../../../assets/photoes/LOGO.png'; // תמונת ברירת מחדל
  therapistId: number | undefined;

  constructor(private router: Router, private therapistSessionService: TherapistSessionService) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user_name = user.first_name + ' ' + user.last_name || 'משתמש';
    // קבלת מזהה המטפל מהסשן
    this.therapistId = this.therapistSessionService.getTherapistId();
    // עדכון מזהה המטפל אם יש שינוי בסשן
    this.therapistSessionService.therapist$.subscribe(t => {
      this.therapistId = t?.therapist?.therapist_id;
    });
  }

  onPatientsClick() {
    this.therapistId = this.therapistSessionService.getTherapistId();
    this.selectedSection = 'patients';
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

