import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl1 = 'https://shirat-moshe-server.onrender.com/api/MonthlyData/login'; 
  // private apiUrl = 'http://localhost:5038/api/MonthlyData'; 

  constructor(private http: HttpClient) {
    console.log(this.apiUrl1,"מה קורה??????");
  }

  login(username: string, password: string): Observable<any> {
    console.log("api:", this.apiUrl1);
  return this.http.post<any>(this.apiUrl1, { username, password }).pipe(
    catchError(error => {
      console.error('Error occurred during login:', error);
      return throwError(() => error);  // להחזיר את השגיאה
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
