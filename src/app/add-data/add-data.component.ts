import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { AuthService } from '../_services/auth.service';
import { forkJoin } from 'rxjs';
import { MonthlyDraftService } from '../_services/MonthlyDraft.service';



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
    'totalAmount',
    'datot',
    'orElchanan',
    'addAmount',
    'ginusar',
    'notes',
  ];
  avrechName: string = '';
  selectedAbrek: any = null;
  showPopup: boolean = false;
  totalOrElchanan: number = 0;
  totalAddAmount: number = 0;
  totalBase: number = 0;
  totalAmount: number = 0;
  totalDatot: number = 0;
  totalGinusar: number = 0;

  constructor(
    private myService: MonthlyDataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private draftService: MonthlyDraftService
    // private configService: CalculationConfigService
   ){}

//   ngOnInit(): void {
//     this.getRecords();
//  }

ngOnInit(): void {
  const draft = this.draftService.getDraft();

  if (draft) {
    this.records = draft.records;
    this.selectedMonth = draft.selectedMonth;
    this.selectedYear = draft.selectedYear;

    this.calculateTotals(); // חשוב
  } else {
    this.getRecords();
  }
}


getRecords() {
  forkJoin({
    avrechimData: this.myService.getAvrechim(1, 300),
    recordsData: this.myService.getRecords(this.year, this.month)
  }).subscribe(({ avrechimData, recordsData }) => {
    this.avrechim = avrechimData.avrechim;

    this.records = recordsData
  .filter(r => {
    console.log("r.personId", r.personId);
    const avrech = this.avrechim.find(a => a.id === r.personId);
    return avrech && !avrech.isSuspended;
  })
  .sort((a, b) => {
    const nameA = this.getAvrechName(a.personId);
    const nameB = this.getAvrechName(b.personId);
    return nameA.localeCompare(nameB, 'he');
  });
  this.c();
  });
}

c(){
    this.totalBase = this.records.reduce((sum, record) => sum + (record.baseAllowance || 0), 0);
    this.totalOrElchanan = this.records.reduce((sum, record) => sum + (record.orElchanan || 0), 0);
    this.totalDatot = this.records.reduce((sum, record) => sum + (record.datot || 0), 0);
    this.totalAmount = this.records.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
    this.totalAddAmount = this.records.reduce((sum, record) => sum + (record.addAmount || 0), 0);
    this.totalGinusar = this.records.reduce((sum, record) => sum + (record.ginusar || 0), 0);
}

// get sumIsChabura(): number {
//   return this.configService.sumIsChabura;
// }

// get sumTest(): number {
//   return this.configService.sumTest;
// }
saveData(): void {
  console.log("נכנס לשמירה");

    // בדיקה אם המשתמש לא מורשה להוסיף נתונים
    if (this.authService.getUsernameFromToken()=='Viewer') {
      this.snackBar.open('אין לך הרשאות לשמור נתונים', 'סגור', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'] // עיצוב ייחודי להודעת שגיאה
      });
      return; // עוצר את שמירת הנתונים
    }

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

          // ⭐ כאן מנקים את הטיוטה
    this.draftService.clearDraft();

      alert("נתונים נשמרו בהצלחה");
    },
    error: (error) => {
      console.error('שגיאה בשמירת נתונים', error);
      console.log('סטטוס שגיאה:', error.status);  // הדפסת סטטוס השגיאה

      if(error.status === 403){
        this.snackBar.open('אין לך הרשאות להוסיף נתונים','סגור',  {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['conflict-snackbar']
        });
      } else if (error.status === 409 ) {
        this.snackBar.open('נתונים עבור החודש והשנה הללו כבר קיימים', 'סגור', {
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

saveDraftState() {
  this.draftService.saveDraft({
    records: this.records,
    selectedMonth: this.selectedMonth,
    selectedYear: this.selectedYear
  });
}

cancelChanges() {
  this.draftService.clearDraft();
  this.getRecords();
}


isValidHebrewYear(year: string): boolean {
  const regex = /^תש[א-ת]"[א-ת]$/;
  return regex.test(year);
}

calculateTotals(): void {
  this.totalOrElchanan = this.records.reduce((sum, record) => sum + (record.orElchanan || 0), 0);
  this.totalAddAmount = this.records.reduce((sum, record) => sum + (record.addAmount || 0), 0);
  this.totalBase = this.records.reduce((sum, record) => sum + (record.baseAllowance || 0), 0);
  this.totalAmount = this.records.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
  this.totalDatot = this.records.reduce((sum, record) => sum + (record.datot || 0), 0);
  this.totalGinusar = this.records.reduce((sum, record) => sum + (record.ginusar || 0), 0);
    this.saveDraftState();

}

// calculateTotalAmount(record: any): void {
//   console.log(record, "calculateTotalAmount");

//   const baseAllowance = record.baseAllowance || 0;
//   const isChabura = record.isChabura;
//   const test = record.didLargeTest || 0;

//   // חישוב הסכום הסופי
//   record.totalAmount = baseAllowance + (isChabura ? 300 : 0) + (test ? 500 : 0);
//   this.calculateTotals();
// }

calculateTotalAmount(record: MonthlyRecord): void {
  const base = record.baseAllowance || 0;
  const chabura = record.isChabura ? 300 : 0; // דוגמה — תלוי כמה את נותנת על חבורה
  const test = record.didLargeTest ? 500 : 0; // גם זה רק דוגמה

  // סכום סופי ללא דתות
  record.totalAmount = base + chabura + test;

  // אחרי שמחשבים את הסכום הסופי — נחשב את אור אלחנן והיתרה
  this.calculateOrElchanan(record);
    this.saveDraftState();

}

// calculateOrElchanan(record: MonthlyRecord): void{
//   console.log(record.isChabura, "vvvvv");
//   console.log(record, "calculateOrElchanan");
//   let avrech = this.getAvrechByPersonId(record.personId);
//   if( avrech && ( avrech.status == "יום שלם" || avrech?.status == "ראש כולל" )){
//     console.log("אברך יום שלם");
//     if(record.isChabura){
//       if( record.totalAmount <= 2300 ){
//         record.orElchanan = record.totalAmount
//       } else{
//         record.orElchanan = 2300;
//         record.addAmount = record.totalAmount - record.orElchanan;
//       }
//     }else{
//       if( record.totalAmount <= 2000 ){
//         record.orElchanan = record.totalAmount
//       } else{
//         console.log(record);
//         record.orElchanan = 2000;
//         record.addAmount = record.totalAmount - record.orElchanan;
//       }
//     }
//   }else if(avrech && ( avrech.status == "חצי יום" || avrech.status == "ראש קבוצה בבוקר" || avrech.status == "ראש קבוצה אחה צ" )){
//     if(record.isChabura){
//       if( record.totalAmount <= 1300 ){
//         record.orElchanan = record.totalAmount
//       } else{
//         record.orElchanan = 1300;
//         record.addAmount = record.totalAmount - record.orElchanan;
//       }
//     }else{
//       if( record.totalAmount <= 1000 ){
//         record.orElchanan = record.totalAmount
//       } else{
//         console.log(record);
//         record.orElchanan = 1000;
//         record.addAmount = record.totalAmount - record.orElchanan;
//       }
//     }
//   }else{
//     record.orElchanan = record.totalAmount;
//   }
    
//   this.calculateTotals();
// }

calculateOrElchanan(record: MonthlyRecord): void {
  const avrech = this.getAvrechByPersonId(record.personId);
  const datot = record.datot || 0;

  // הסכום הזמין לחלוקה בין אור אלחנן ליתרה
  const availableForOrElchanan = record.totalAmount - datot;
  let maxOrElchanan = 0;

  if (avrech && (avrech.status === "יום שלם" || avrech.status === "ראש כולל")) {
    console.log("יום שלם או ראש כולל");
    maxOrElchanan = 2300;
    if (availableForOrElchanan >= maxOrElchanan){
      record.orElchanan = maxOrElchanan;
      record.addAmount = availableForOrElchanan - maxOrElchanan;
    }
    else{
      record.orElchanan = availableForOrElchanan;
      record.addAmount = 0;
    }

  } else if (
    avrech &&
    (avrech.status === "חצי יום" ||
    avrech.status === " חצי יום" ||
     avrech.status === "ראש קבוצה בבוקר" ||
     avrech.status === "ראש קבוצה אחה צ")
  ) {
    console.log("ראש קבוצה או חצי יום");
    maxOrElchanan = 1300;
    if (availableForOrElchanan >= maxOrElchanan){
      record.orElchanan = maxOrElchanan;
      record.addAmount = availableForOrElchanan - maxOrElchanan;
    }
    else{
      record.orElchanan = availableForOrElchanan;
      record.addAmount = 0;
    }
      } else {
            console.log("אין סטטוס");
      console.log(avrech);
    // ברירת מחדל — אם אין התאמה בסטטוס
    maxOrElchanan = availableForOrElchanan;
    record.orElchanan = record.totalAmount;
    
  }

  // חישוב אור אלחנן לפי המקסימום
  // record.orElchanan = Math.min(maxOrElchanan, availableForOrElchanan);

  // // חישוב יתרה – רק אם נשאר מעבר למקסימום
  // record.addAmount = Math.max(availableForOrElchanan - record.orElchanan, 0);

  this.calculateTotals();

}

getAvrechByPersonId(personId: number): Avrech | undefined {
  return this.avrechim.find(avrech => avrech.id === personId);
}

// calculateAdd(record: MonthlyRecord): void {
//   console.log(record, "calculateAdd");
//   if(record.totalAmount - record.orElchanan >=0){
//     record.addAmount = record.totalAmount - record.orElchanan;
//   }
//   else{
//     record.addAmount = 0;
//   }
//   this.calculateTotals();
// }

calculateAdd(record: MonthlyRecord): void {
  record.addAmount = Math.max(
    (record.totalAmount - (record.datot || 0)) - record.orElchanan,
    0
  );
    this.saveDraftState();

}

calculateTotalGinusar() {
  this.totalGinusar = this.records.reduce((sum, record) => {
    return sum + (Number(record.ginusar) || 0);
  }, 0);
    this.saveDraftState();

}

calculateTotalAndOrElchanan(record: MonthlyRecord): void {
  this.calculateTotalAmount(record);   // קודם חישוב סכום סופי
  this.calculateOrElchanan(record);    // אחר כך אור אלחנן והיתרה
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


