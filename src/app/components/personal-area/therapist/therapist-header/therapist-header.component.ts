import { Component, HostListener, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TherapistSessionService } from 'src/app/services/therapist-session.service';

@Component({
  selector: 'app-therapist-header',
  templateUrl: './therapist-header.component.html',
  styleUrls: ['./therapist-header.component.css', '../../../../styles/header.css']
})
export class TherapistHeaderComponent implements OnInit {
  @Input() selectedSection: string = 'home';
  @Output() sectionChange = new EventEmitter<string>();
  showProfileMenu = false;
  user_name = '';
  userImage = '../../../assets/photoes/LOGO.png'; // תמונת ברירת מחדל
  therapistId: number | undefined;

  constructor(private therapistSessionService: TherapistSessionService) { }

  ngOnInit() {
    const userObj = JSON.parse(localStorage.getItem('user') || '{}');
    this.user_name =
      (userObj.user?.first_name || '') + ' ' + (userObj.user?.last_name || '') ||
      userObj.user?.user_name ||
      'משתמש';
    // קבלת מזהה המטפל מהסשן
    this.therapistId = this.therapistSessionService.getTherapistId();
    // עדכון מזהה המטפל אם יש שינוי בסשן
    this.therapistSessionService.therapist$.subscribe(t => {
      this.therapistId = t?.therapist?.therapist_id;
    });
  }

  onPatientsClick() {
    this.therapistId = this.therapistSessionService.getTherapistId();
    this.sectionChange.emit('patients');
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

  logout() {
    this.showProfileMenu = false;
    localStorage.clear();
    window.location.href = '/';
  }
}

