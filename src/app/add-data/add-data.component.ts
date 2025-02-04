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
import { CalculationConfigService } from '../_services/calculation-config.service';



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
  totalOrElchanan: number = 62980;
  totalAddAmount: number = 5920;

   

  constructor(
    private myService: MonthlyDataService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    // private configService: CalculationConfigService
   ){}

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

// get sumIsChabura(): number {
//   return this.configService.sumIsChabura;
// }

// get sumTest(): number {
//   return this.configService.sumTest;
// }
saveData(): void {
  console.log("נכנס לשמירה");
      // בדיקה אם המשתמש מילא חודש ושנה
      if (!this.selectedMonth || !this.selectedYear) {
        this.snackBar.open('אנא מלא את החודש והשנה לפני שמירת השינויים', 'סגור', {
          duration: 9000, // משך זמן הצגת ההודעה (במילישניות)
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        return; // עצירה מיידית של הפעולה
      }

      if (!this.isValidHebrewYear(this.selectedYear)) {
        console.log( "knv??");
        this.snackBar.open('שנה עברית לא תקינה. אנא הזן שנה בתצורת "תשפ"ה"', 'סגור', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        return;
      }

      
      const newRecords = this.records.map(record => ({
        ...record, // העתקת כל הנתונים הקיימים
        id: 0, // איפוס ה-ID כדי שהשרת ייצור חדש
        year: this.selectedYear,
        month: this.selectedMonth
      }));

  console.log('שומר נתונים:', newRecords);
  this.myService.addMonthlyRecords(newRecords).subscribe({
    next: (response) => {
      console.log('נתונים נשמרו בהצלחה', response);
      alert("נתונים נשמרו בהצלחה");
    },
    error: (error) => {
      console.error('שגיאה בשמירת נתונים', error);
      if (error === 'נתונים עבור החודש והשנה הללו כבר קיימים.') {
        this.snackBar.open(error, 'סגור', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['conflict-snackbar'] // מחלקה ייחודית לעיצוב
        });
      } else {
        this.snackBar.open('אירעה שגיאה בשמירת הנתונים.', 'סגור', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    }
  });
}

isValidHebrewYear(year: string): boolean {
  const regex = /^תש[א-ת]"[א-ת]$/;
  return regex.test(year);
}




calculateTotals(): void {
  this.totalOrElchanan = this.records.reduce((sum, record) => sum + (record.orElchanan || 0), 0);
  this.totalAddAmount = this.records.reduce((sum, record) => sum + (record.addAmount || 0), 0);
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
