import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/_services/auth.service'; // ודא שזה הנתיב הנכון

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/']); // הפניה לדף התחברות אם לא מחובר
      return false;
    }
    return true;
  }
}
