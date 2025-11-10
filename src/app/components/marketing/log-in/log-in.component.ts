// log-in.component.ts
import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


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

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userName = res.user.name || res.user.username || '';
        }
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const role = user.role;
        // סגירת הדיאלוג והחזרת התפקיד באנגלית
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


  showForgotPassword() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = false;
    this.forgatPassword = true;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = false;
  }

}