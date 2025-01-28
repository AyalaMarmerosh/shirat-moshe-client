import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  
  getAvrechim(page: number, pageSize: number): Observable<{avrechim : Avrech[], totalAvrechim: number}>{
    return this.http.get<{ avrechim: Avrech[], totalAvrechim: number}>( `https://shirat-moshe-server.onrender.com/api/MonthlyData?page=${page}&pageSize=${pageSize}`)
      .pipe(catchError(this.handleError1<{ avrechim: Avrech[], totalAvrechim: number }>('getAvrechim', {avrechim: [], totalAvrechim: 0}))
    );
  }

  getSearchAvrech(query: string = '', filterPresence: string = '', filterDatot: string = '', filterStatus: string = ''): Observable<Avrech[]>{
    return this.http.get< Avrech[]>( `${this.apiUrl}/search?query=${query}&presence=${filterPresence}&datot=${filterDatot}&status=${filterStatus}`)
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

    return this.http
      .get<MonthlyRecord[]>(`${this.apiUrl}/${id}/monthlydata?${query}`)
      .pipe(catchError(this.handleError1< MonthlyRecord[]>('GetMonthlyData', [])));
  }
  
  private handleError1<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  updateAvrech(avrech: Avrech): Observable<any> {
    return this.http.put(`${this.apiUrl}/${avrech.id}`, avrech);
  }

  deleteAvrech(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
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
  
    return this.http.get< MonthlyRecord[] >(`${this.apiUrl}/last-month?${query}`)
  }
  getAvrechById(id: number): Observable<Avrech> {
    return this.http.get<Avrech>(`${this.apiUrl}/${id}/avrech`);
  }
  
  addMonthlyRecords(monthlyRecords: MonthlyRecord[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addData`, monthlyRecords);
  }
  addAvrech(avrech: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, avrech).pipe(
      catchError(this.handleError)
    );
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
