import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // ייבוא של ה-AuthService

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();  // קבלת הטוקן מתוך ה-AuthService

    if (token) {
      // יצירת בקשה חדשה עם הוספת כותרת Authorization
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`  // מוסיף את הטוקן לכותרת
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);  // אם אין טוקן, ממשיך עם הבקשה הרגילה
  }
}
