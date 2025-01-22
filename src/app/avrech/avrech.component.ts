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
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddAvrechDialogComponent } from '../add-avrech-dialog/add-avrech-dialog.component';

@Component({
  selector: 'app-avrech',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatSelectModule, MatIcon],
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
  selectedAvrech: Avrech = {
    fullName: '',
    teudatZeut: '',
    dateOfBirth: null,
    street: '',
    houseNumber: '',
    phone: '',
    cellPhone: '',
    cellPhone2: '',
    bank: '',
    branch: '',
    accountNumber: '',
    status: '',
    datot: '',
    isPresent: '',
    id: 0
  }; // אברך שנבחר לעדכון
  searchQuery = '';
  filterPresence: string = '';
  filterStatus: string = '';
  filterDatot: string = '';
  filteredAvrechim: Avrech[] = [];
  isFormVisible: boolean = false

  
  constructor(private myService: MonthlyDataService, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getAvrechim();
  }

  getAvrechim(): void {
    if (this.searchQuery || this.filterDatot || this.filterPresence || this.filterStatus) {
      this.myService.getSearchAvrech(this.searchQuery || '', this.filterPresence || '', this.filterDatot || '', this.filterStatus || '').subscribe((data) => {
        console.log("data", data);
        console.log("total", data.length);

        this.avrechim = data;
        this.totalAvrechim = data.length;
        // this.applyFilters(); // עדכון הרשימה המסוננת
      });
    } else {
    this.myService.getAvrechim(this.page + 1, this.pageSize).subscribe((data) => {
        this.avrechim = data.avrechim;
        this.totalAvrechim = data.totalAvrechim;
        // this.applyFilters(); // עדכון הרשימה המסוננת

      },
      error => {
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
  loadMonthlyData(id: number, year: string, month: string): void {
    console.log("check", id, year, month);
    this.myService.GetMonthlyData(id, year, month).subscribe(
      (data) => {
        console.log('Data received:', data); // הדפסת התגובה
          this.monthlyData[id] = data; // אחסון לפי ID
          this.isMonthlyDataVisible[id] = true;  // הצגת הנתונים
          console.log('Monthly Data for ID', id, ':', this.monthlyData);
        },
      (error) => {
        console.error('Error loading monthly data for id:', id, error);
        this.monthlyData[id] = [];
      }
    );
  }
  
  

  pageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.page = event.pageIndex;
    this.getAvrechim();
  }
  
  // פונקציה לעדכון אברך
  editAvrech(avrech: Avrech): void {
    // if (this.selectedAvrech?.fullName) {
    // }    
    this.selectedAvrech = { ...avrech }; 
    this.isFormVisible = true;

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

  replaceSpacesWithUnderscore(input: string): string {
    return input.replace(/\s+/g, '_'); // מחליף את כל הרווחים ב-_
  }

  // פונקציה לשמירה של השינויים
  saveAvrech(): void {
    if (this.selectedAvrech) {
      console.log(this.selectedAvrech);
      // this.selectedAvrech.fullName = `${this.firstName} ${this.lastName}`;

      this.selectedAvrech.datot = this.replaceSpacesWithUnderscore(this.selectedAvrech.datot);
      this.selectedAvrech.status = this.replaceSpacesWithUnderscore(this.selectedAvrech.status);
      console.log(this.selectedAvrech);

      this.myService.updateAvrech(this.selectedAvrech).subscribe(
        () => {
          this.getAvrechim(); // רענון הרשימה אחרי עדכון
          this.isFormVisible = false;
          // this.selectedAvrech = null; // סגירת הטופס
        },
        (error) => {
          console.error('Error saving avrech data', error);
        }
      );
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
