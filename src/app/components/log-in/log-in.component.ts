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
  changePasswordDisplayed: boolean = false; // דיאלוג החלפת סיסמה

  password: string = '';
  user_name: string = '';
  resetUserName: string = ''; // שם משתמש לשחזור סיסמה
  isLoadingReset: boolean = false; // אינדיקטור טעינה
  
  // טיימר לסיסמה זמנית
  countdown: string = '5:00';
  private countdownInterval: any;
  
  // החלפת סיסמה
  changePasswordData = {
    user_name: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  isLoadingChange: boolean = false;

  constructor(
    private authService: AuthService,
    private therapistSessionService: TherapistSessionService,
    private router: Router
  ) {}
  
  ngOnDestroy() {
    // ניקוי הטיימר כשניצאים מהקומפוננטה
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
    // Removed duplicate constructor
  onEnter() {
    if (this.user_name && this.password) {
      this.onLogin();
    }
  }
  onLogin() {
  this.authService.login(this.user_name, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.user_name = res.user.user_name || '';
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
        // ניתוב לפי תפקיד
        if (role === 'company_manager') {
          this.router.navigate(['/company-manager']);
        } else if (role === 'therapist') {
          this.router.navigate(['/personal-area/therapist']);
        } else if (role === 'patient') {
          this.router.navigate(['/personal-area/patient']);
        } else if (role === 'secretary') {
          this.router.navigate(['/personal-area/secretary']);
        } else if (role === 'admin') {
          this.router.navigate(['/personal-area/admin']);
        } else {
          this.router.navigate(['/']);
        }
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
    this.resetUserName = ''; // איפוס שדה שם המשתמש
  }
  
  // שליחת בקשה לשחזור סיסמה
  sendResetPassword() {
    if (!this.resetUserName || this.resetUserName.trim() === '') {
      alert('אנא הזן שם משתמש');
      return;
    }

    this.isLoadingReset = true;
    
    this.authService.forgotPassword(this.resetUserName).subscribe({
      next: (response) => {
        this.isLoadingReset = false;
        console.log('Password reset response:', response);
        this.startCountdown(); // התחלת טיימר
        this.showPasswordHasBeenSent();
      },
      error: (err) => {
        this.isLoadingReset = false;
        console.error('Password reset error:', err);
        alert('שגיאה בשליחת המייל. אנא נסה שוב מאוחר יותר');
      }
    });
  }
  
  // טיימר ספירה לאחור 5 דקות
  startCountdown() {
    let totalSeconds = 5 * 60; // 5 דקות
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdownInterval = setInterval(() => {
      totalSeconds--;
      
      if (totalSeconds <= 0) {
        clearInterval(this.countdownInterval);
        this.countdown = 'פג תוקף';
        return;
      }
      
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      this.countdown = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
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
    this.changePasswordDisplayed = false;
  }
  
  // הצגת דיאלוג החלפת סיסמה
  showChangePassword() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = false;
    this.forgatPassword = false;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = false;
    this.changePasswordDisplayed = true;
    // איפוס שדות
    this.changePasswordData = {
      user_name: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }
  
  // שליחת בקשה להחלפת סיסמה
  changePassword() {
    // בדיקות ולידציה
    if (!this.changePasswordData.user_name || !this.changePasswordData.oldPassword || 
        !this.changePasswordData.newPassword || !this.changePasswordData.confirmPassword) {
      alert('אנא מלא את כל השדות');
      return;
    }
    
    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmPassword) {
      alert('הסיסמאות החדשות אינן תואמות');
      return;
    }
    
    if (this.changePasswordData.newPassword.length < 6) {
      alert('הסיסמה החדשה חייבת להיות באורך 6 תווים לפחות');
      return;
    }
    
    this.isLoadingChange = true;
    
    this.authService.changePassword(
      this.changePasswordData.user_name,
      this.changePasswordData.oldPassword,
      this.changePasswordData.newPassword
    ).subscribe({
      next: (response) => {
        this.isLoadingChange = false;
        alert('הסיסמה שונתה בהצלחה!');
        this.showConnectionForm();
      },
      error: (err) => {
        this.isLoadingChange = false;
        alert('שגיאה: ' + (err.error?.message || 'לא ניתן לשנות סיסמה'));
      }
    });
  }
}