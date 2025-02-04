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
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatSnackBarModule,
    MatTooltipModule,
  MatIcon],
  templateUrl: './monthly-data.component.html',
  styleUrl: './monthly-data.component.css'
})
export class MonthlyDataComponent implements OnInit{
  records: MonthlyRecord[] = [];
  avrechim: Avrech[] = [];
  displayedColumns: string[] = [
    'edit',
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
  searchName: string = '';
  isLoading = false; // משתנה למעקב אחרי מצב הטעינה
  editingIndex: number | null = null; // משתנה למעקב אחרי השורה המהווה מצב עריכה


  
  constructor(private myService: MonthlyDataService, private snackBar: MatSnackBar, private dialog: MatDialog   ){}

  ngOnInit(): void {
    this.getRecords();
  }

  getRecords(){
    this.isLoading = true;
    this.getAvrechim();
    this.myService.getRecords(this.selectedYear, this.selectedMonth).subscribe((data) => {
      this.isLoading = false; // סיום טעינה
      console.log("nvnvnv", data);
      const hebrewMonthsOrder = [
        'תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'אדר א', 'אדר ב',
        'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'
      ];

      this.records = data
      .filter(rec => this.searchName ? this.getAvrechName(rec.personId).includes(this.searchName) : true)
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
      this.isLoading = false; // סיום טעינה
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
getTotalOrElchanan(): number {
  return this.records.reduce((sum, record) => sum + (record.orElchanan || 0), 0);
}

getTotalAddAmount(): number {
  return this.records.reduce((sum, record) => sum + (record.addAmount || 0), 0);
}

isEditing(index: number): boolean {
  return this.editingIndex === index;
}

// פונקציה שמבצעת את ההפעלה לעריכת שורה
editRow(index: number): void {
  console.log("ID", this.records)
  this.editingIndex = index; // קובעים שהשורה בתהליך עריכה
}


saveRow(record: MonthlyRecord): void {
        // בדיקה אם המשתמש מילא חודש ושנה
        if (!record.month || !record.year) {
          this.snackBar.open('אנא מלא את החודש והשנה לפני שמירת השינויים', 'סגור', {
            duration: 9000, // משך זמן הצגת ההודעה (במילישניות)
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          return; // עצירה מיידית של הפעולה
        }

        if (!this.isValidHebrewYear(record.year)) {
          console.log( "knv??");
          this.snackBar.open('שנה עברית לא תקינה. אנא הזן שנה בתצורת "תשפ"ה"', 'סגור', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          return;
        }
  this.myService.updateData(record).subscribe(
    () => {
      console.log('data updated successfully');
      this.snackBar.open('הפרטים שונו בהצלחה!', 'סגור', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });      this.getRecords();
      this.editingIndex = null; // מחזירים את השורה למצב קריאה
    },
    (error: any) => {
      console.error('Error saving avrech data', error);
      alert("הייתה שגיאה בעדכון הנתונים");
    }
  );  

}

isValidHebrewYear(year: string): boolean {
  const regex = /^תש[א-ת]"[א-ת]$/;
  return regex.test(year);
}
// פונקציה לביטול העריכה
cancelEdit(): void {
  this.getRecords();
  this.editingIndex = null; // ביטול העריכה
}

calculateTotals(): void {
  this.getTotalOrElchanan();
  this.getTotalAddAmount();
}

calculateTotalAmount(record: any): void {
  console.log(record, "calculateTotalAmount");

  const baseAllowance = record.baseAllowance || 0;
  const isChabura = record.isChabura;
  const datot = record.datot || 0;
  const test = record.didLargeTest || 0;

  // חישוב הסכום הסופי
  record.totalAmount = baseAllowance + (isChabura ? 300 : 0) + (test ? 500 : 0) - datot;
  this.calculateTotals();
}
calculateOrElchanan(record: MonthlyRecord): void{
  console.log(record.isChabura, "vvvvv");
  console.log(record, "calculateOrElchanan");
  let avrech = this.getAvrechByPersonId(record.personId);
  if( avrech && ( avrech.status == "אברך רצופות יום שלם" || avrech?.status == "ראש כולל" )){
    console.log("אברך יום שלם");
    if(record.isChabura){
      if( record.totalAmount <= 2300 ){
        record.orElchanan = record.totalAmount
      } else{
        record.orElchanan = 2300;
        record.addAmount = record.totalAmount - record.orElchanan;
      }
    }else{
      if( record.totalAmount <= 2000 ){
        record.orElchanan = record.totalAmount
      } else{
        console.log(record);
        record.orElchanan = 2000;
        record.addAmount = record.totalAmount - record.orElchanan;
      }
    }
  }else if(avrech && ( avrech.status == "אברך רצופות חצי יום" || avrech.status == "ראש קבוצה בבוקר" || avrech.status == "ראש קבוצה אחה צ" )){
    if(record.isChabura){
      if( record.totalAmount <= 1300 ){
        record.orElchanan = record.totalAmount
      } else{
        record.orElchanan = 1300;
        record.addAmount = record.totalAmount - record.orElchanan;
      }
    }else{
      if( record.totalAmount <= 1000 ){
        record.orElchanan = record.totalAmount
      } else{
        console.log(record);
        record.orElchanan = 1000;
        record.addAmount = record.totalAmount - record.orElchanan;
      }
    }
  }else{
    record.orElchanan = record.totalAmount;
  }
    
  this.calculateTotals();
}

getAvrechByPersonId(personId: number): Avrech | undefined {
  return this.avrechim.find(avrech => avrech.id === personId);
}

calculateAdd(record: MonthlyRecord): void {
  console.log(record, "calculateAdd");
  record.addAmount = record.totalAmount - record.orElchanan;
  this.calculateTotals();
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
