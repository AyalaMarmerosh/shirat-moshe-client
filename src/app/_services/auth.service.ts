import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://shirat-moshe-server.onrender.com/api/MonthlyData'; 

  constructor(private http: HttpClient) {}

   // התחברות
   login(username: string, password: string): Observable<any> {
    console.log("login called with", { username, password });
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => console.log("Server response:", response)),
      catchError(error => {
        console.error("Error during login:", error);
        throw error;
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
