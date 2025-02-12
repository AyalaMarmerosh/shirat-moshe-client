import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MonthlyRecord } from '../_models/MonthlyRecord';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Avrech } from '../_models/avrech';

@Injectable({
  providedIn: 'root'
})
export class MonthlyDataService {

  private apiUrl = 'https://shirat-moshe-server.onrender.com/api/MonthlyData'; 

  constructor(private http: HttpClient) { }

  private createAuthorizationHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    console.log("token???", token);
    if (token) {
      console.log("token!");
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();  // אם אין טוקן, מחזירים header ריק
  }
  
  getAvrechim(page: number, pageSize: number): Observable<{avrechim : Avrech[], totalAvrechim: number}>{
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.get<{ avrechim: Avrech[], totalAvrechim: number}>( `${this.apiUrl}?page=${page}&pageSize=${pageSize}`, { headers })
      .pipe(catchError(this.handleError1<{ avrechim: Avrech[], totalAvrechim: number }>('getAvrechim', {avrechim: [], totalAvrechim: 0}))
    );
  }

  getSearchAvrech(query: string = '', filterPresence: string = '', filterDatot: string = '', filterStatus: string = ''): Observable<Avrech[]>{
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.get< Avrech[]>( `${this.apiUrl}/search?query=${query}&presence=${filterPresence}&datot=${filterDatot}&status=${filterStatus}`, {headers})
      .pipe(catchError(this.handleError1< Avrech[] >('SearchAvrech', []))
    );
  }


  GetMonthlyData(id: number, year: string, month?: string): Observable<MonthlyRecord[]> {
    const encodedYear = encodeURIComponent(year); // קידוד השנה
    let query = `year=${encodedYear}`; // תמיד הוסף שנה

    // הוסף חודש רק אם הוא קיים
    if (month && month.trim() !== '') {
      const encodedMonth = encodeURIComponent(month);
      query += `&month=${encodedMonth}`;
  }
    const headers = this.createAuthorizationHeaders();
    return this.http
      .get<MonthlyRecord[]>(`${this.apiUrl}/${id}/monthlydata?${query}`, {headers})
      .pipe(catchError(this.handleError1< MonthlyRecord[]>('GetMonthlyData', [])));
  }
  
  private handleError1<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  updateAvrech(avrech: Avrech): Observable<any> {
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.put(`${this.apiUrl}/${avrech.id}`, avrech, {headers});
  }

  updateData(data: MonthlyRecord): Observable<any> {
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    console.log("data", data)
    return this.http.put(`${this.apiUrl}/${data.id}/data`, data, {headers});
  }

  deleteAvrech(id: number): Observable<any> {
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.delete(`${this.apiUrl}/${id}`, {headers});
  }

  deleteData(id: number): Observable<any> {
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.delete(`${this.apiUrl}/${id}/data`, {headers});
  }

  getRecords(year?: string, month?: string): Observable< MonthlyRecord[] > {
    let query = ``; 

    if (year && year.trim() !== '') {
      const encodedyear = encodeURIComponent(year);
      query += `&year=${encodedyear}`;
  }

      if (month && month.trim() !== '') {
        const encodedMonth = encodeURIComponent(month);
        query += `&month=${encodedMonth}`;
    }
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.get< MonthlyRecord[] >(`${this.apiUrl}/last-month?${query}`, {headers})
  }
  getAvrechById(id: number): Observable<Avrech> {
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.get<Avrech>(`${this.apiUrl}/${id}/avrech`, {headers});
  }
  
  addMonthlyRecords(monthlyRecords: MonthlyRecord[]): Observable<any> {
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן

    return this.http.post<any>(`${this.apiUrl}/addData`, monthlyRecords, {headers}).pipe(
      // catchError(this.handleErrorData)
    );
  }
  addOenData(data: MonthlyRecord): Observable<any> {
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.post<any>(`${this.apiUrl}/add-one-data`, data, {headers}).pipe(
      // catchError(this.handleErrorData)
    );
  }
  addAvrech(avrech: any): Observable<any> {
    const headers = this.createAuthorizationHeaders();  // יצירת headers עם הטוקן
    return this.http.post(`${this.apiUrl}/add`, avrech, {headers}).pipe(
      catchError(this.handleError)
    );
  }
  private handleErrorData(error: HttpErrorResponse) {
    console.log("מה הסטטוס של השגיאה???", error, error.status)
    if (error.status === 409) {
      // שגיאה של נתונים קיימים, נוכל להחזיר את ההודעה ללקוח
      console.log(" עבור אברך זה נתונים עבור החודש והשנה הללו כבר קיימים");
      return throwError(' עבור אברך זה נתונים עבור החודש והשנה הללו כבר קיימים.');
      
    } else if(error.status === 403){
      console.log("אין לך הרשאות להוסיף נתונים");
      return throwError('אין לך הרשאות להוסיף נתונים');
    }
     else {
      return throwError('אירעה שגיאה בשמירת הנתונים.');
    }
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = error.error || `Error Code: ${error.status}`;
    }
    return throwError(errorMessage);
  }
}
