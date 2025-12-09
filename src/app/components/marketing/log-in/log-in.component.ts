import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TherapistSessionService } from 'src/app/services/therapist-session.service';
import { TherapistCreationData, TherapistData } from 'src/app/models/therapist.model';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  showPassword: boolean = false;
  enrollmentFormDisplayed: boolean = false;
  connectionFormDisplayed: boolean = true;
  forgatPassword: boolean = false;
  passwordHasBeenSent: boolean = false;
  SendingPasswordToMail: boolean = false;

  email: string = '';
  password: string = '';
  userName: string = '';

  constructor(private authService: AuthService, private therapistSessionService: TherapistSessionService) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userName = res.user.name || res.user.username || '';
        }
        // שמירת מזהה לפי תפקיד
        if (res.therapist_id) {
          localStorage.setItem('therapist_id', res.therapist_id.toString());
          localStorage.setItem('therapist', JSON.stringify({ therapist_id: res.therapist_id }));

          // שמירת פרטי המטפל בסשן
          const therapistData: TherapistData = { therapist_id: res.therapist_id };
          const therapistSession: TherapistCreationData = {
            user: res.user,
            person: res.user?.person || {},
            therapist: therapistData,
            selectedDepartments: res.selectedDepartments || []
          };
          this.therapistSessionService.setTherapist(therapistSession);
        }
        if (res.patient_id) {
          localStorage.setItem('patient_id', res.patient_id.toString());
        }
        if (res.secretary_id) {
          localStorage.setItem('secretary_id', res.secretary_id.toString());
        }
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role;
        (window as any).dialogRef?.close(role);
      },
      error: (err) => {
        alert('שגיאה בהתחברות: ' + (err.error?.message || err.message || 'נסה שוב מאוחר יותר'));
      }
    });
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
   }

  showEnrollmentForm() {
    this.enrollmentFormDisplayed = true;
    this.connectionFormDisplayed = false;
    this.forgatPassword = false;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = false;
  }

  showConnectionForm() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = true;
    this.forgatPassword = false;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = false;
  }
  showSendingPasswordToMail() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = false;
    this.forgatPassword = false;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = true;
  }
  showPasswordHasBeenSent() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = false;
    this.forgatPassword = false;
    this.passwordHasBeenSent = true;
    this.SendingPasswordToMail = false;
  }
  showForgotPassword() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = false;
    this.forgatPassword = true;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = false;
  }
}