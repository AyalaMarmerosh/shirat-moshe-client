import { Component } from '@angular/core';
import { CalculationConfigService } from '../_services/calculation-config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { MatCard, MatCardContent, MatCardFooter, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatChip } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { MonthlyDataService } from '../_services/monthly-data.service';
import { MonthlyRecord } from '../_models/MonthlyRecord';
import { Avrech } from '../_models/avrech';
import { PopupComponent } from '../add-data/popup.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
     CommonModule,
  FormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTableModule,
  MatCardModule,
  MatPaginatorModule,
  MatSnackBarModule,
  MatDialogModule,
  MatExpansionModule,
  MatIcon
],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  oldUsername = '';
  newUsername = '';
  newPassword = '';
  verificationCode = ''; // שדה חדש לקוד אימות
  message = '';
  codeSent = false; // מצב למעקב אם קוד האימות נשלח
   records: MonthlyRecord[] = [];
    avrechim: Avrech[] = [];
    year = 'Default';
    month = 'Default';
    selectedMonth: string = '';
    selectedYear: string = '';
    displayedColumns: string[] = [
      'index',
      'id',
      // 'month',
      // 'year',
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
     totalOrElchanan: number = 0;
  totalAddAmount: number = 0;
  totalBase: number = 0;
  totalAmount: number = 0;
  totalDatot: number = 0;
  totalGinusar: number = 0;
  

 constructor(  private configService: CalculationConfigService, private authService: AuthService,     private myService: MonthlyDataService,     private dialog: MatDialog){}


   ngOnInit(): void {
    this.getRecords();
 }

 sendVerificationCode() {
  if(this.oldUsername === '' || this.newPassword === '' || this.newUsername === ''){
    this.message = 'אנא מלא קודם את השדות הנדרשים';
  }else{
      this.authService.sendVerificationCode(this.oldUsername, this.newUsername, this.newPassword)
    .subscribe({
      next: () => {
        this.codeSent = true; // אם הקוד נשלח בהצלחה, נעדכן את המשתמש
        this.message = 'קוד האימות נשלח למייל שלך.';
      },
      error: (err) => {
        console.log(err)
        this.message = `שגיאה: ${err}`
      }
    });
  }
}

updateCredentials() {
  if (!this.codeSent) {
    this.message = 'יש לשלוח קודם קוד אימות.';
    return;
  }
  
  this.authService.updateCredentials(this.oldUsername, this.newUsername, this.newPassword, this.verificationCode)
    .subscribe({
      next: () => this.message = 'הנתונים עודכנו בהצלחה',
      error: err => this.message = `שגיאה: ${err}`
    });
}

hidePassword: boolean = true;  // ברירת מחדל: הסיסמה מוסתרת

togglePasswordVisibility(): void {
  this.hidePassword = !this.hidePassword;  // מתחלף בין הסתרה להצגה
}
 get sumIsChabura(): number {
  return this.configService.sumIsChabura;
}

set sumIsChabura(value: number) {
  this.configService.sumIsChabura = value;
}

get sumTest(): number {
  return this.configService.sumTest;
}

set sumTest(value: number) {
  this.configService.sumTest = value;
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


getAvrechName(id: number): string {
  const avrech = this.avrechim.find(a => a.id === id);
  return avrech ? avrech.lastName + " " + avrech.firstName : 'לא נמצא';
}

onAbrekClick(abrechId: number): void {
    const abrek = this.getAvrech(abrechId);
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '550px',
      height: '450px',
      data: { abrek }
    });
  }

  getAvrech(id: number): Avrech | undefined{
  const avrech = this.avrechim.find(a => a.id === id);
  return avrech ? avrech : undefined;
}


calculateTotalAmount(record: MonthlyRecord): void {
  const base = record.baseAllowance || 0;
  const chabura = record.isChabura ? 300 : 0; // דוגמה — תלוי כמה את נותנת על חבורה
  const test = record.didLargeTest ? 500 : 0; // גם זה רק דוגמה

  // סכום סופי ללא דתות
  record.totalAmount = base + chabura + test;

  // אחרי שמחשבים את הסכום הסופי — נחשב את אור אלחנן והיתרה
  this.calculateOrElchanan(record);
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

calculateTotals(): void {
  this.totalOrElchanan = this.records.reduce((sum, record) => sum + (record.orElchanan || 0), 0);
  this.totalAddAmount = this.records.reduce((sum, record) => sum + (record.addAmount || 0), 0);
  this.totalBase = this.records.reduce((sum, record) => sum + (record.baseAllowance || 0), 0);
  this.totalAmount = this.records.reduce((sum, record) => sum + (record.totalAmount || 0), 0);
  this.totalDatot = this.records.reduce((sum, record) => sum + (record.datot || 0), 0);
  this.totalGinusar = this.records.reduce((sum, record) => sum + (record.ginusar || 0), 0);
}

calculateTotalAndOrElchanan(record: MonthlyRecord): void {
  this.calculateTotalAmount(record);   // קודם חישוב סכום סופי
  this.calculateOrElchanan(record);    // אחר כך אור אלחנן והיתרה
}


calculateAdd(record: MonthlyRecord): void {
  record.addAmount = Math.max(
    (record.totalAmount - (record.datot || 0)) - record.orElchanan,
    0
  );
}

calculateTotalGinusar() {
  this.totalGinusar = this.records.reduce((sum, record) => {
    return sum + (Number(record.ginusar) || 0);
  }, 0);
}

saveAsDefault(): void {
  if (!this.records || this.records.length === 0) {
    return;
  }

  const defaultRecords = this.records.map(r => ({
    ...r,
    year: 'Default',
    month: 'Default'
  }));

  this.myService.saveDefaultRecords(defaultRecords).subscribe({
    next: () => {
      alert('נתוני ברירת המחדל עודכנו בהצלחה');
    },
    error: (err: any) => {
      console.error(err);
      alert('שגיאה בשמירת נתוני ברירת מחדל');
    }
  });
}


}
