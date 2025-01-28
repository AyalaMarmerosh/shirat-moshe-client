import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MonthlyRecord } from '../_models/MonthlyRecord';
import { Avrech } from '../_models/avrech';
import { MonthlyDataService } from '../_services/monthly-data.service';
import * as XLSX from 'xlsx';
import { PopupComponent } from '../add-data/popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-monthly-data',
  standalone: true,
  imports: [FormsModule, CommonModule, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatSnackBarModule],
  templateUrl: './monthly-data.component.html',
  styleUrl: './monthly-data.component.css'
})
export class MonthlyDataComponent implements OnInit{
  records: MonthlyRecord[] = [];
  avrechim: Avrech[] = [];
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
    'notes'
  ];
  selectedMonth: string = '';
  selectedYear: string = '';
  
  constructor(private myService: MonthlyDataService, private snackBar: MatSnackBar, private dialog: MatDialog   ){}

  ngOnInit(): void {
    this.getRecords();
  }

  getRecords(){
    this.getAvrechim();
    this.myService.getRecords(this.selectedYear, this.selectedMonth).subscribe((data) => {
      console.log("nvnvnv", data);
      const hebrewMonthsOrder = [
        'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'אדר א', 'אדר ב',
        'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'
      ];

      this.records = data
      .filter(rec => rec.year !== 'Default')
      .sort((a, b) => {
        // מיון לפי שנה (בסדר יורד)
        if (a.year !== b.year) {
          return b.year.localeCompare(a.year);
        }

          // מיון לפי חודש (על פי הסדר במערך)
          const monthAIndex = hebrewMonthsOrder.indexOf(a.month);
          const monthBIndex = hebrewMonthsOrder.indexOf(b.month);
          return monthBIndex - monthAIndex;
        });
    },
    error => {
      alert("יש שגיאה בטעינת הנתונים")
      console.error('Error loading data', error);
    }
  );
}
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
exportToExcel(): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.records); // המרת הנתונים לפורמט שניתן לייצא
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'נתונים חודשיים'); // הוספת גיליון

  // יצירת הקובץ והורדה
  XLSX.writeFile(wb, 'monthly_data.xlsx');
}

}
