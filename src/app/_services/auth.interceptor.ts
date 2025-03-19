import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';  // ייבוא של ה-AuthService
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();  // קבלת הטוקן מתוך ה-AuthService

    let clonedRequest = req;
    if (token) {
      // יצירת בקשה חדשה עם הוספת כותרת Authorization
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`  // מוסיף את הטוקן לכותרת
        }
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          alert('החיבור שלך פג, נא להתחבר מחדש.');
          this.authService.logout(); // התנתקות
        }
        return throwError(() => error);
      })
    );
  }
}
