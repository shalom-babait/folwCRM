import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }


  // הגנה על ראוטים לפי role:
  const expectedRole = route.data['expectedRole'];
  if (expectedRole && authService.getRoleFromToken() !== expectedRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true; // המשתמש מחובר
};
