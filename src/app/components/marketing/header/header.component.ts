import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogInComponent } from '../log-in/log-in.component';
import { ConsultationMeetingComponent } from '../../consultation-meeting/consultation-meeting.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{
  constructor(private dialog: MatDialog, private router: Router) {}

  openLogInDialog() {
    const dialogRef = this.dialog.open(LogInComponent, {
       width: '50rem',
    });
    // שמירה גלובלית כדי לאפשר סגירה מתוך הדיאלוג
    (window as any).dialogRef = dialogRef;
    dialogRef.afterClosed().subscribe(role => {
      if (!role) return;
      switch (role) {
        case 'therapist':
          this.router.navigate(['/personal-area/therapist']);
          break;
        case 'patient':
          this.router.navigate(['/personal-area/patient']);
          break;
        case 'secretary':
          this.router.navigate(['/personal-area/secretary/therapists']);
          break;
        case 'admin':
          this.router.navigate(['/personal-area/admin']);
          break;
        default:
          this.router.navigate(['/']);
      }
    });
  }
  openConsultationMeetingDialog() {
    const dialogRef = this.dialog.open(ConsultationMeetingComponent, {
       width: '50rem',
    });
alert
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
  scrollToAbout() {
    window.scrollTo( 0, window.innerHeight);
  }
}

