import { Component, OnInit } from '@angular/core';
import { Avrech } from '../_models/avrech';
import { MonthlyDataService } from '../_services/monthly-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MonthlyRecord } from '../_models/MonthlyRecord';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddAvrechDialogComponent } from '../add-avrech-dialog/add-avrech-dialog.component';
import { PopupComponent } from './updatePopup.component'
@Component({
  selector: 'app-avrech',
  standalone: true,
  imports: [    MatIconModule,
  CommonModule, FormsModule, MatPaginatorModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatSelectModule],
  templateUrl: './avrech.component.html',
  styleUrl: './avrech.component.css'
})
export class AvrechComponent implements OnInit{
  
  avrechim: Avrech[] = [];
  totalAvrechim: number = 0;
  page: number = 0;
  pageSize: number = 9;
  monthlyData: { [key: number]: MonthlyRecord[] } = {};
  isMonthlyDataVisible: { [key: number]: boolean } = {}; // מצב הצגת הנתונים החודשיים
  searchQuery = '';
  filterPresence: string = '';
  filterStatus: string = '';
  filterDatot: string = '';
  filteredAvrechim: Avrech[] = [];
  // isFormVisible: boolean = false
  isLoading = false; // משתנה למעקב אחרי מצב הטעינה


  
  constructor(private myService: MonthlyDataService, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getAvrechim();
  }

  getAvrechim(): void {
    this.isLoading = true; // התחלת טעינה
    if (this.searchQuery || this.filterDatot || this.filterPresence || this.filterStatus) {
      this.myService.getSearchAvrech(this.searchQuery || '', this.filterPresence || '', this.filterDatot || '', this.filterStatus || '').subscribe((data) => {
        console.log("data", data);
        console.log("total", data.length);

        this.avrechim = data;
        this.totalAvrechim = data.length;
        this.isLoading = false; // סיום טעינה

        // this.applyFilters(); // עדכון הרשימה המסוננת
      });
    } else {
    this.myService.getAvrechim(this.page + 1, this.pageSize).subscribe((data) => {
        this.avrechim = data.avrechim;
        this.totalAvrechim = data.totalAvrechim;
        this.isLoading = false; // סיום טעינה

        // this.applyFilters(); // עדכון הרשימה המסוננת

      },
      error => {
        this.isLoading = false; // סיום טעינה
        console.error('Error loading data', error);
      }
    );
  }
  }
  
  openAddAvrechDialog() {
    const dialogRef = this.dialog.open(AddAvrechDialogComponent, {
      width: '500px', 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('הפופ-אפ נסגר');
    });
  }

  openEditDialog(avrech: Avrech): void {
    const dialogRef = this.dialog.open(PopupComponent, {height:'75%', width: '500px', data: avrech });
    dialogRef.afterClosed().subscribe(() => this.getAvrechim());
  }
  loadMonthlyData(id: number, year: string, month: string): void {
    console.log("check", id, year, month);
    this.myService.GetMonthlyData(id, year, month).subscribe(
      (data) => {
        console.log('Data received:', data); // הדפסת התגובה
          this.monthlyData[id] = data; // אחסון לפי ID
          this.isMonthlyDataVisible[id] = true;  // הצגת הנתונים
          console.log('Monthly Data for ID', id, ':', this.monthlyData);
          if(data.length == 0){
            alert("לא נמצאו נתונים לשנה/לחודש שנבחרו")
          }
        },
      (error) => {
        alert("שגיאה")
        console.error('Error loading monthly data for id:', id, error);
        this.monthlyData[id] = [];
      }
    );
  }
  
  

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex;
    this.getAvrechim();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }
  
 
  formatDate(date: Date | null | undefined): string {
    if(date != null){
    const formattedDate = new Date(date);
    return `${formattedDate.getDate().toString().padStart(2, '0')}/${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}/${formattedDate.getFullYear()}`;
  }    
  else{
    return "";
  }
}


  // פונקציה למחיקת אברך
  deleteAvrech(id: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את האברך הזה?')) {
      this.myService.deleteAvrech(id).subscribe(
        () => {
          this.getAvrechim(); // רענון הרשימה אחרי מחיקה
        },
        (error) => {
          console.error('Error deleting avrech', error);
        }
      );
    }
  }

  
}
