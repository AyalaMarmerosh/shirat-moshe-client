import { MonthlyRecord } from './../_models/MonthlyRecord';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Avrech } from '../_models/avrech';
import { MonthlyDataService } from '../_services/monthly-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { AddDataComponent } from '../add-data/add-data.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule,
    MatCheckbox,
  ],
  template: `
    <div dir="rtl" class="popup-container">
      <h2>הוספת נתונים עבור{{ selectedAvrech ? " " + selectedAvrech.lastName + " " + selectedAvrech.firstName : ''}}</h2>
      <form>
        <mat-form-field>
          <mat-label>בחר אברך</mat-label>
          <mat-select [(ngModel)]="selectedAvrechId" (ngModelChange)="loadMonthlyData()" name="select">
            <mat-option *ngFor="let avrech of avrechim" [value]="avrech.id">
              {{ avrech.lastName }} {{ avrech.firstName }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>חודש</mat-label>
          <input matInput type="text" [(ngModel)]="month" name="month">
        </mat-form-field>

        <mat-form-field>
          <mat-label>שנה</mat-label>
          <input matInput type="text" [(ngModel)]="year" name="year">
        </mat-form-field>

        <mat-form-field>
          <mat-label>מלגה בסיסית</mat-label>
          <input matInput type="number" [(ngModel)]="record.baseAllowance" (ngModelChange)="calculateTotalAmount()" (ngModelChange)="calculateOrElchanan()" (ngModelChange)="calculateAdd()" name="base">
        </mat-form-field>

        <mat-checkbox [(ngModel)]="record.isChabura" (ngModelChange)="calculateTotalAmount()" (ngModelChange)="calculateOrElchanan()" (ngModelChange)="calculateAdd()" name="chabura">חבורה</mat-checkbox>

        <mat-checkbox [(ngModel)]="record.didLargeTest" (ngModelChange)="calculateTotalAmount()" (ngModelChange)="calculateOrElchanan()" (ngModelChange)="calculateAdd()" name="test">מבחן</mat-checkbox>

        <mat-form-field>
          <mat-label>דתות</mat-label>
          <input matInput type="number" [(ngModel)]="record.datot" (ngModelChange)="calculateTotalAmount()" (ngModelChange)="calculateOrElchanan()" (ngModelChange)="calculateAdd()" name="datot">
        </mat-form-field>

        <mat-form-field>
          <mat-label>סכום סופי</mat-label>
          <input name="total" matInput type="number" [(ngModel)]="record.totalAmount" (ngModelChange)="calculateOrElchanan()" (ngModelChange)="calculateAdd()" readonly>
        </mat-form-field>

        <mat-form-field>
          <mat-label>אור אלחנן</mat-label>
          <input name="or" matInput type="number" [(ngModel)]="record.orElchanan" (ngModelChange)="calculateAdd()">
        </mat-form-field>

        <mat-form-field>
          <mat-label>יתרה</mat-label>
          <input name="add" matInput type="number" [(ngModel)]="record.addAmount">
        </mat-form-field>

        <mat-form-field>
          <mat-label>הערות</mat-label>
          <input name="note" matInput type="text" [(ngModel)]="record.notes">
        </mat-form-field>

        <button style="background-color: #ffd740 ;" mat-button (click)="saveRecord()">שמירה</button>
      </form>
    </div>
  `,
  styles: [
    `
      .popup-container {
        padding: 20px;
        max-width: 800px;
        margin: auto;
        text-align: center;
      }
      mat-form-field {
        width: 100%;
      }
      @media (max-width: 768px) {
        mat-form-field {
          max-width: 100%;
        }
      }
    `
  ]
})
export class InsertOneDataComponent {
  avrechim: Avrech[] = [];
  selectedAvrechId: number | null = null;
  record: MonthlyRecord = {} as MonthlyRecord;
  month: string = '';
  year: string = '';
  selectedAvrech: Avrech | undefined;

  constructor(
    private myService: MonthlyDataService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InsertOneDataComponent>,
  ) {}

  ngOnInit(): void{
    this.getAvrechim();
  }
  getAvrechim(): void {
    this.myService.getAvrechim(1, 200).subscribe((data) => {
      this.avrechim = data.avrechim;
    });
  }

 calculateTotalAmount(): void {
    console.log(this.record, "calculateTotalAmount");
  
    const baseAllowance = this.record.baseAllowance || 0;
    const isChabura = this.record.isChabura;
    const datot = this.record.datot || 0;
    const test = this.record.didLargeTest || 0;
  
    // חישוב הסכום הסופי
    this.record.totalAmount = baseAllowance + (isChabura ? 300 : 0) + (test ? 500 : 0) - datot;
  }

  getAvrechByPersonId(personId: number): Avrech | undefined {
    return this.avrechim.find(avrech => avrech.id === personId);
  }

 calculateOrElchanan(): void{

    let avrech = this.getAvrechByPersonId(this.record.personId);
    if( avrech && ( avrech.status == "אברך רצופות יום שלם" || avrech?.status == "ראש כולל" )){
      console.log("אברך יום שלם");
      if(this.record.isChabura){
        if( this.record.totalAmount <= 2300 ){
          this.record.orElchanan = this.record.totalAmount
        } else{
          this.record.orElchanan = 2300;
          this.record.addAmount = this.record.totalAmount - this.record.orElchanan;
        }
      }else{
        if( this.record.totalAmount <= 2000 ){
          this.record.orElchanan = this.record.totalAmount
        } else{
          console.log(this.record);
          this.record.orElchanan = 2000;
          this.record.addAmount = this.record.totalAmount - this.record.orElchanan;
        }
      }
    }else if(avrech && ( avrech.status == "אברך רצופות חצי יום" || avrech.status == "ראש קבוצה בבוקר" || avrech.status == "ראש קבוצה אחה צ" )){
      if(this.record.isChabura){
        if( this.record.totalAmount <= 1300 ){
          this.record.orElchanan = this.record.totalAmount
        } else{
          this.record.orElchanan = 1300;
          this.record.addAmount = this.record.totalAmount - this.record.orElchanan;
        }
      }else{
        if( this.record.totalAmount <= 1000 ){
          this.record.orElchanan = this.record.totalAmount
        } else{
          console.log(this.record);
          this.record.orElchanan = 1000;
          this.record.addAmount = this.record.totalAmount - this.record.orElchanan;
        }
      }
    }else{
      this.record.orElchanan = this.record.totalAmount;
    }
      
  }
  
  loadMonthlyData(): void {
    if (!this.selectedAvrechId) {
        return;
      }
      this.selectedAvrech = this.getAvrechByPersonId(this.selectedAvrechId);

      console.log("Loading data for:", this.selectedAvrechId, 'Default', 'Default');
  
      this.myService.GetMonthlyData(this.selectedAvrechId, 'Default', 'Default').subscribe(
        (data) => {
          console.log("Data received:", data);
          this.record = { ...data[0] }; // מעתיק את הנתונים לטופס
        },
        (error) => {
          console.error("Error loading monthly data:", error);
          alert("שגיאה בטעינת הנתונים");
        }
      );
  }

 calculateAdd(): void {
    console.log(this.record, "calculateAdd");
    if(this.record.totalAmount - this.record.orElchanan >=0){
      this.record.addAmount = this.record.totalAmount - this.record.orElchanan;
    }
    else{
      this.record.addAmount = 0;
    }  }

  isValidHebrewYear(year: string): boolean {
    console.log(this.record.year);
    const regex = /^תש[א-ת]"[א-ת]$/;
    return regex.test(year);
  }

  saveRecord(): void {
    console.log("נכנס לשמירה");
    if(!this.selectedAvrechId){
        this.snackBar.open('אנא בחר את האברך שברצונך להוסיף לו נתונים', 'סגור', {
            duration: 9000, // משך זמן הצגת ההודעה (במילישניות)
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          return; // עצירה מיידית של הפעולה
    }
        // בדיקה אם המשתמש מילא חודש ושנה
        if (!this.month || !this.year) {
          this.snackBar.open('אנא מלא את החודש והשנה לפני שמירת השינויים', 'סגור', {
            duration: 9000, // משך זמן הצגת ההודעה (במילישניות)
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          return; // עצירה מיידית של הפעולה
        }

        this.record.month = this.month;
        this.record.year = this.year;

        console.log(this.record);
  
        if (!this.isValidHebrewYear(this.record.year)) {
          console.log( "knv??");
          this.snackBar.open('שנה עברית לא תקינה. אנא הזן שנה בתצורת "תשפ"ה"', 'סגור', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          return;
        }

        this.record.id = 0;
        
  
    console.log('שומר נתונים:', this.record);
    this.myService.addOenData(this.record).subscribe({
      next: (response) => {
        console.log('נתונים נוספו בהצלחה', response);
        alert("נתונים נוספו בהצלחה");
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('שגיאה בהוספת הנתונים', error);
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
}
