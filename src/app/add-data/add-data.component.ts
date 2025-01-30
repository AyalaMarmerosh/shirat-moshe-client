import { Component, OnInit } from '@angular/core';
import { MonthlyDataService } from '../_services/monthly-data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MonthlyRecord } from '../_models/MonthlyRecord';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Avrech } from '../_models/avrech';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupComponent } from './popup.component';



@Component({
  selector: 'app-dd-data',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './add-data.component.html',
  styleUrl: './add-data.component.css'
})
export class AddDataComponent implements OnInit{

  records: MonthlyRecord[] = [];
  avrechim: Avrech[] = [];
  year = 'Default';
  month = 'Default';
  selectedMonth: string = '';
  selectedYear: string = '';
  displayedColumns: string[] = [
    'index',
    'id',
    'month',
    'year',
    'baseAllowance',
    'isChabura',
    'didLargeTest',
    'datot',
    'totalAmount',
    'orElchanan',
    'addAmount',
    'notes',
  ];
  avrechName: string = '';
  selectedAbrek: any = null;
  showPopup: boolean = false;
  

  constructor(private myService: MonthlyDataService, private snackBar: MatSnackBar, private dialog: MatDialog   ){}

  ngOnInit(): void {
    this.getRecords();
  }

  getRecords(){
    this.getAvrechim();
    this.myService.getRecords(this.year, this.month).subscribe((data) => {
      console.log("nvnvnv", data)
      this.records = data;
    },
    error => {
      console.error('Error loading data', error);
    }
  );
}
saveData(): void {
      // בדיקה אם המשתמש מילא חודש ושנה
      if (!this.selectedMonth || !this.selectedYear) {
        this.snackBar.open('אנא מלא את החודש והשנה לפני שמירת השינויים', 'סגור', {
          duration: 3000, // משך זמן הצגת ההודעה (במילישניות)
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        return; // עצירה מיידית של הפעולה
      }

  this.records.forEach((record) => {
    record.year = this.selectedYear; // שנה נבחרת
    record.month = this.selectedMonth; // חודש נבחר
  });
  console.log('שומר נתונים:', this.records);
  this.myService.addMonthlyRecords(this.records).subscribe({
    next: (response) => {
      console.log('נתונים נשמרו בהצלחה', response);
      alert("נתונים נשמרו בהצלחה");
    },
    error: (error) => {
      console.error('שגיאה בשמירת נתונים', error);
      this.snackBar.open('אירעה שגיאה בשמירת הנתונים. נסי שוב.', 'סגור', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  });
  // כאן ניתן להוסיף קריאה לשרת לשמירת הנתונים
}

calculateTotalAmount(record: any): void {
  const baseAllowance = record.baseAllowance || 0;
  const isChabura = record.isChabura;
  const datot = record.datot || 0;
  const test = record.didLargeTest || 0;

  // חישוב הסכום הסופי
  record.totalAmount = baseAllowance + (isChabura ? 300 : 0) + (test ? 500 : 0) - datot;
}
calculateAdd(record: MonthlyRecord): void {
  record.addAmount = record.totalAmount - record.orElchanan;
}
// פונקציה שתפעל כאשר לוחצים על שם האברך
  // onAbrekClick(abrek: any): void {
  //   console.log("nv eurv knv t, kt n,pkk,?", abrek.personId)
  //   this.selectedAbrek = abrek;
  //   this.getAvrechName(abrek.personId);
  //   this.showPopup = true;
  // }
  onAbrekClick(abrechId: number): void {
    const abrek = this.getAvrech(abrechId);
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '550px',
      height: '450px',
      data: { abrek }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
    });
  }
  // פונקציה לסגירת הפופ-אפ
  closePopup(): void {
    this.showPopup = false;
    this.selectedAbrek = null;
  }

  // פונקציה לשליפת הנתונים של האברכים
  getAvrechim(): void {
    this.myService.getAvrechim(1, 100).subscribe((data) => {
      this.avrechim = data.avrechim;
    });
  }
getAvrechName(id: number): string {
  const avrech = this.avrechim.find(a => a.id === id);
  return avrech ? avrech.lastName + " " + avrech.firstName : 'לא נמצא';
}
getAvrech(id: number): Avrech | undefined{
  const avrech = this.avrechim.find(a => a.id === id);
  return avrech ? avrech : undefined;
}
}
