// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-log-in',
//   templateUrl: './log-in.component.html',
//   styleUrls: ['./log-in.component.css']
// })
// export class LogInComponent {
//   enrollmentFormDisplayed: boolean = false;
//   connectionFormDisplayed: boolean = true;
//   forgatPassword: boolean = false;
//   passwordHasBeenSent:boolean=false;
//   SendingPasswordToMail:boolean=false;

//   showEnrollmentForm() {
//     this.enrollmentFormDisplayed = true;
//     this.connectionFormDisplayed = false;
//     this.forgatPassword = false;
//     this.passwordHasBeenSent=false;
//     this.SendingPasswordToMail=false;
//   }

//   showConnectionForm() {
//     this.enrollmentFormDisplayed = false;
//     this.connectionFormDisplayed = true;
//     this.forgatPassword = false;
//     this.passwordHasBeenSent=false;
//     this.SendingPasswordToMail=false;
//   }
//   showSendingPasswordToMail()
//   {
//     this.enrollmentFormDisplayed = false;
//     this.connectionFormDisplayed = false;
//     this.forgatPassword = false;
//     this.passwordHasBeenSent=false;
//     this.SendingPasswordToMail=true;
//   }
//   showPasswordHasBeenSent(){
//     this.enrollmentFormDisplayed = false;
//     this.connectionFormDisplayed = false;
//     this.forgatPassword = false;
//     this.passwordHasBeenSent=true;
//     this.SendingPasswordToMail=false;
//   }
//   showForgotPassword() {
//     this.enrollmentFormDisplayed = false;
//     this.connectionFormDisplayed = false;
//     this.forgatPassword = true;
//     this.passwordHasBeenSent=false;
//     this.SendingPasswordToMail=false;
//   }
// }

// log-in.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  enrollmentFormDisplayed: boolean = false;
  connectionFormDisplayed: boolean = true;
  forgatPassword: boolean = false;
  passwordHasBeenSent: boolean = false;
  SendingPasswordToMail: boolean = false;

  // נתוני התחברות
  loginData = {
    email: '',
    password: ''
  };

  // נתוני הרשמה
  registrationData = {
    firstName: '',
    lastName: '',
    id: '',
    phone: '',
    city: '',
    address: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false
  };

  // הודעות שגיאה והצלחה
  loginError: string = '';
  registrationError: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  showEnrollmentForm() {
    this.enrollmentFormDisplayed = true;
    this.connectionFormDisplayed = false;
    this.forgatPassword = false;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = false;
    this.clearMessages();
  }

  showConnectionForm() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = true;
    this.forgatPassword = false;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = false;
    this.clearMessages();
  }

  showSendingPasswordToMail() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = false;
    this.forgatPassword = false;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = true;
    this.clearMessages();
  }

  showPasswordHasBeenSent() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = false;
    this.forgatPassword = false;
    this.passwordHasBeenSent = true;
    this.SendingPasswordToMail = false;
    this.clearMessages();
  }

  showForgotPassword() {
    this.enrollmentFormDisplayed = false;
    this.connectionFormDisplayed = false;
    this.forgatPassword = true;
    this.passwordHasBeenSent = false;
    this.SendingPasswordToMail = false;
    this.clearMessages();
  }

  clearMessages() {
    this.loginError = '';
    this.registrationError = '';
    this.successMessage = '';
  }

  // פונקציית התחברות
  login() {
    this.clearMessages();

    // וולידציה בסיסית
    if (!this.loginData.email || !this.loginData.password) {
      this.loginError = 'אנא מלא את כל השדות החובה';
      return;
    }

    const loginPayload = {
      email: this.loginData.email,
      password: this.loginData.password
    };

    this.http.post('http://localhost:3000/api/users/login', loginPayload)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = 'התחברות בוצעה בהצלחה!';
            // כאן תוכלי לשמור את נתוני המשתמש ולנווט לעמוד אחר
            console.log('User logged in:', response.data.user);
            // localStorage.setItem('user', JSON.stringify(response.data.user));
            // this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          if (error.status === 401) {
            this.loginError = 'אימייל או סיסמה שגויים. אם עדיין לא נרשמת, לחץ על "עוד לא הצטרפת אלינו"';
          } else {
            this.loginError = 'שגיאה בהתחברות. נסה שוב מאוחר יותר';
          }
        }
      });
  }

  // פונקציית הרשמה
  register() {
    this.clearMessages();

    // וולידציה בסיסית
    if (!this.registrationData.firstName || !this.registrationData.lastName || 
        !this.registrationData.phone || !this.registrationData.city || 
        !this.registrationData.email || !this.registrationData.password || 
        !this.registrationData.confirmPassword) {
      this.registrationError = 'אנא מלא את כל השדות החובה';
      return;
    }

    // בדיקת התאמת סיסמאות
    if (this.registrationData.password !== this.registrationData.confirmPassword) {
      this.registrationError = 'הסיסמאות אינן תואמות';
      return;
    }

    const registrationPayload = {
      first_name: this.registrationData.firstName,
      last_name: this.registrationData.lastName,
      teudat_zehut: this.registrationData.id || null,
      phone: this.registrationData.phone,
      city: this.registrationData.city,
      address: this.registrationData.address || null,
      email: this.registrationData.email,
      password: this.registrationData.password,
      role: 'מטופל',
      agree: this.registrationData.agree ? 1 : 0
    };

    this.http.post('http://localhost:3000/api/users', registrationPayload)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = 'הרשמה בוצעה בהצלחה! אתה יכול כעת להתחבר';
            this.clearRegistrationForm();
            // מעבר לטופס התחברות
            setTimeout(() => {
              this.showConnectionForm();
            }, 2000);
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
          if (error.status === 409) {
            this.registrationError = 'משתמש עם אימייל זה כבר קיים במערכת';
          } else if (error.error && error.error.message) {
            this.registrationError = error.error.message;
          } else {
            this.registrationError = 'שגיאה בהרשמה. נסה שוב מאוחר יותר';
          }
        }
      });
  }

  clearRegistrationForm() {
    this.registrationData = {
      firstName: '',
      lastName: '',
      id: '',
      phone: '',
      city: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false
    };
  }
}