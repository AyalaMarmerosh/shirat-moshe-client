import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl1 = 'https://shirat-moshe-server.onrender.com/api/MonthlyData'; 

  
  constructor(private http: HttpClient, private router: Router) {
    this.startTokenExpirationCheck(); // הפעלת הבדיקה עם טעינת השירות
    this.setupVisibilityChangeListener(); // הפעלת הבדיקה כשחוזרים לכרטיסייה
   }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false; // אם אין טוקן, המשתמש לא מחובר
    }
        // בדיקת תוקף הטוקן
        const tokenData = this.decodeToken(token);
        if (!tokenData || tokenData.exp * 1000 < Date.now()) {
          return false; // אם התוקף פג, המשתמש לא מחובר
        }
    
        return true; // אחרת המשתמש מחובר
      }
      private decodeToken(token: string): any {
        try {
          const payload = token.split('.')[1];  // לוקח את החלק השני של ה-JWT (payload)
          return JSON.parse(atob(payload));  // מפענח את ה-Base64 ומחזיר אובייקט JSON
        } catch (e) {
          return null;
        }
      }
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl1}/login`, { username, password }).pipe(
    tap(res => {
      if(res.token){
        this.saveToken(res.token);
      }
    }),
    catchError(error => {
      return throwError(() => error);  // להחזיר את השגיאה
    })
  );
}

sendVerificationCode(oldUsername: string, newUsername: string, newPassword: string): Observable<any> {
  const body = { oldUsername, newUsername, newPassword };
  return this.http.post<any>(`${this.apiUrl1}/send-verification-code`, body, { responseType: 'text' as 'json' })
    .pipe(
      catchError(error => {
        return throwError(() => error);  // להחזיר את השגיאה
      })
    );
}

updateCredentials(oldUsername: string, newUsername: string, newPassword: string, verificationCode: string): Observable<any> {
  const body = { oldUsername, newUsername, newPassword };

  return this.http.post<string>(`${this.apiUrl1}/update-credentials?code=${verificationCode}`, body, { responseType: 'text' as 'json' })
    .pipe(
      catchError(error => {
        console.log("Error:", error);
        return throwError(() => error);  // החזרת השגיאה
      })
    );
}


  // בדיקת אם יש טוקן שמאוחסן
  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // שמירת הטוקן ב-LocalStorage
  saveToken(token: string): void {
    sessionStorage.setItem('token', token);
    console.log(sessionStorage.getItem('token'));
  }

  // הסרת הטוקן
  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']); // הפניה לדף ההתחברות
  }

  // 🕒 פונקציה שבודקת כל 5 שניות אם הטוקן פג
  private startTokenExpirationCheck(): void {
    setInterval(() => {
      if (!this.isAuthenticated()) {
        alert('החיבור שלך פג, נא להתחבר מחדש.');
        this.logout();
      }
    }, 5000); // כל 5 שניות
  }

  // 🔄 בדיקה כשחוזרים לכרטיסייה אם הטוקן עדיין תקף
  private setupVisibilityChangeListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        if (!this.isAuthenticated()) {
          alert('החיבור שלך פג, נא להתחבר מחדש.');
          this.logout();
        }
      }
    });
  }

  getUsernameFromToken(): string | null {
    console.log("נכנס לפונקציה");
    const token = this.getToken();
    if (!token) {
      return null;
    }
    console.log("נכנס לפונקציה", token);

    const tokenData = this.decodeToken(token);
    console.log("נכנס לפונקציה", tokenData);

    return tokenData ? tokenData.role : null;
  }
  
  
}
