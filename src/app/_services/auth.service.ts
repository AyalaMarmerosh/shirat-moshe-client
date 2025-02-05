import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl1 = 'https://shirat-moshe-server.onrender.com/api/MonthlyData'; 

  
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl1}/login`, { username, password }).pipe(
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
    return localStorage.getItem('token');
  }

  // שמירת הטוקן ב-LocalStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // הסרת הטוקן
  logout(): void {
    localStorage.removeItem('token');
  }
  
}
