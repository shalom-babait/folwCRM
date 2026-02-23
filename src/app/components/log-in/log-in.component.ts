import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TherapistSessionService } from 'src/app/services/therapist-session.service';
import { TherapistCreationData, TherapistData } from 'src/app/models/therapist.model';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { UserStateService } from 'src/app/services/state/user-state.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  // מיפוי תפקידים לנתיבים - במקום כפילות
  private readonly routes: { [key: string]: string } = {
    company_manager: '/company-manager',
    therapist: '/personal-area/therapist',
    patient: '/personal-area/patient',
    secretary: '/personal-area/secretary',
    admin: '/personal-area/admin'
  };
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
    private router: Router,
    private route: ActivatedRoute,
    private errorHandler: ErrorHandlerService,
    private userState: UserStateService
  ) {}

  // ===================== Lifecycle Hooks =====================
  ngOnInit() {
    // בדיקה אם יש callback מ-Google
    this.route.queryParams.subscribe(params => {
      if (params['googleAuth']) {
        this.handleGoogleCallback(params['googleAuth']);
      } else if (params['error']) {
        // הודעות שגיאה ברורות לפי סוג השגיאה
        const errorMessages: { [key: string]: string } = {
          user_not_registered: 'לא נמצא חשבון במערכת המשויך לכתובת המייל הזו, אם קיבלת הרשאה לשימוש במערכת, יש לפנות למנהל המערכת.',
          google_auth_failed: 'האימות דרך Google נכשל. אנא נסה שוב.',
          no_user: 'לא ניתן לאמת את המשתמש.',
          auth_error: 'שגיאה באימות. אנא נסה שוב מאוחר יותר.',
          callback_error: 'שגיאה בעיבוד התשובה מ-Google.'
        };
        const errorMessage = errorMessages[params['error']] || ('שגיאה באימות Google: ' + params['error']);
        this.errorHandler.handleError(errorMessage);
        // ניקוי ה-URL אחרי הצגת השגיאה - חזרה לדף ההתחברות
        this.router.navigate([''], { replaceUrl: true });
      }
    });
  }

  ngOnDestroy() {
    // ניקוי הטיימר כשניצאים מהקומפוננטה
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  // ===================== Public Methods =====================

  // --- Login & Google ---
  onEnter() {
    if (this.user_name && this.password) {
      this.onLogin();
    }
  }

  onLogin() {
    // בדיקה שיש שם משתמש וסיסמה
    if (!this.user_name || !this.password) {
      this.errorHandler.handleError('נא למלא שם משתמש וסיסמה');
      return;
    }

    this.authService.login(this.user_name, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        if (res.user) {
          this.userState.setUser({ user: res.user, person: res.user?.person || {} });
          this.user_name = res.user.user_name || '';
        }
        // שמירת organization_id
        if (res.organization_id) {
          localStorage.setItem('organization_id', res.organization_id.toString());
        }
        // שמירת מזהה לפי תפקיד
        if (res.therapist_id) {
          localStorage.setItem('therapist_id', res.therapist_id.toString());
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
  const role = user.user?.role;
  // ניתוב לפי תפקיד (משתמש במיפוי אחיד)
  this.router.navigate([this.routes[role] || '/']);
      },
      error: (err) => {
        this.errorHandler.handleHttpError(err);
      }
    });
  }

  loginWithGoogle() {
    // פתיחת חלון Google OAuth
    window.location.href = `${environment.apiUrl}/auth/google`;
  }

  handleGoogleCallback(encodedData: string) {
    try {
      const jsonString = atob(encodedData);
      const response = JSON.parse(jsonString);

      // בדיקה אם ההתחברות הצליחה
      if (!response.success || !response.token) {
        this.errorHandler.handleError('שגיאה באימות Google');
        return;
      }

      // שמירת הטוקן והמשתמש
      localStorage.setItem('token', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        this.user_name = response.user.user_name || '';
      }

      // שמירת organization_id
      if (response.organization_id) {
        localStorage.setItem('organization_id', response.organization_id.toString());
      }

      // שמירת מזהה לפי תפקיד
      if (response.therapist_id) {
        localStorage.setItem('therapist_id', response.therapist_id.toString());
        const therapistData: TherapistData = { therapist_id: response.therapist_id };
        const therapistSession: TherapistCreationData = {
          user: response.user,
          person: response.user?.person || {},
          therapist: therapistData,
          selectedDepartments: response.selectedDepartments || []
        };
        this.therapistSessionService.setTherapist(therapistSession);
      }
      if (response.patient_id) {
        localStorage.setItem('patient_id', response.patient_id.toString());
      }
      if (response.secretary_id) {
        localStorage.setItem('secretary_id', response.secretary_id.toString());
      }

      // ניתוב לפי תפקיד (משתמש במיפוי אחיד)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const role = user.role;
      this.router.navigate([this.routes[role] || '/']);
    } catch (error) {
      console.error('Error handling Google callback:', error);
      this.errorHandler.handleError('שגיאה בעיבוד אימות Google');
    }
  }

  // --- Password & Forms ---
  sendResetPassword() {
    if (!this.resetUserName || this.resetUserName.trim() === '') {
      this.errorHandler.handleError('אנא הזן שם משתמש');
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
        this.errorHandler.handleHttpError(err);
      }
    });
  }

  changePassword() {
    // בדיקות ולידציה
    if (!this.changePasswordData.user_name || !this.changePasswordData.oldPassword || 
        !this.changePasswordData.newPassword || !this.changePasswordData.confirmPassword) {
      this.errorHandler.handleError('אנא מלא את כל השדות');
      return;
    }

    if (this.changePasswordData.newPassword !== this.changePasswordData.confirmPassword) {
      this.errorHandler.handleError('הסיסמאות החדשות אינן תואמות');
      return;
    }

    if (this.changePasswordData.newPassword.length < 6) {
      this.errorHandler.handleError('הסיסמה החדשה חייבת להיות באורך 6 תווים לפחות');
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
        this.errorHandler.handleError('הסיסמה שונתה בהצלחה!');
        this.showConnectionForm();
      },
      error: (err) => {
        this.isLoadingChange = false;
        this.errorHandler.handleHttpError(err);
      }
    });
  }

  // --- UI State ---
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

  // ===================== Private Helpers =====================

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
}