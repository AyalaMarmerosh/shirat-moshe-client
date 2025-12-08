import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Avrech } from '../_models/avrech';
import { MonthlyDataService } from '../_services/monthly-data.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../_services/auth.service';
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
    MatExpansionModule,
    MatSelectModule,
    MatDividerModule,
    MatIconModule
  ],
  template: `
    <div class="popup-container">
      <h2>עדכון פרטי אברך</h2>

      <form (ngSubmit)="saveAvrech()" class="form-container">
        <div class="form-group">
          <mat-form-field appearance="fill" class="w-100">
            <mat-label>נוכחות</mat-label>
            <mat-select [(ngModel)]="selectedAvrech.isPresent" name="isPresent">
              <mat-option value="כן">כן</mat-option>
              <mat-option value="לא">לא</mat-option>
              <mat-option value="בוקר">בוקר</mat-option>
              <mat-option value="צהרים">צהרים</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>דתות</mat-label>
            <mat-select [(ngModel)]="selectedAvrech.datot" name="datot">
              <mat-option value="לא_רשום">לא רשום</mat-option>
              <mat-option value="יום_שלם">יום שלם</mat-option>
              <mat-option value="חצי_יום">חצי יום</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>סטטוס</mat-label>
            <mat-select [(ngModel)]="selectedAvrech.status" name="status">
              <mat-option value="ראש_קבוצה_בבוקר">ראש קבוצה בבוקר</mat-option>
              <mat-option value="ראש_קבוצה_אחה_צ">ראש קבוצה אחה&quot;צ</mat-option>
              <mat-option value="ר&quot;כ אחה&quot;צ והח חצי דתות">ר&quot;כ אחה&quot;צ והח חצי דתות</mat-option>     
              <mat-option value="ראש_כולל">ראש כולל</mat-option>
              <mat-option value="אברך_רצופות_יום_שלם">יום שלם</mat-option>
              <mat-option value="אברך_רצופות_חצי_יום">חצי יום</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field appearance="fill" class="w-100">
            <mat-label>שם משפחה</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.lastName" name="lastName" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>שם פרטי</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.firstName" name="firstName" />
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field appearance="fill" class="w-100">
            <mat-label>מספר זהות</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.teudatZeut" name="teudatZeut" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>תאריך לידה</mat-label>
            <input matInput type="date" [(ngModel)]="selectedAvrech.dateOfBirth" name="dateOfBirth" />
            <button mat-icon-button matSuffix (click)="selectedAvrech.dateOfBirth = null">
              <mat-icon>clear</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field appearance="fill" class="w-100">
            <mat-label>כתובת</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.street" name="street" placeholder="רחוב" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>מספר בית</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.houseNumber" name="houseNumber" placeholder="מספר בית" />
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field appearance="fill" class="w-100">
            <mat-label>טלפון</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.phone" name="phone" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>פלאפון</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.cellPhone" name="cellPhone" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>פלאפון 2</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.cellPhone2" name="cellPhone2" />
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field appearance="fill" class="w-100">
            <mat-label>בנק</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.bank" name="bank" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>סניף</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.branch" name="branch" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-100">
            <mat-label>מספר חשבון</mat-label>
            <input matInput type="text" [(ngModel)]="selectedAvrech.accountNumber" name="accountNumber" />
          </mat-form-field>
        </div>

        <button mat-raised-button color="primary" type="submit" class="submit-button">שמור שינויים</button>
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

      h2 {
        margin-bottom: 20px;
        color: #0369a1;
      }

      .form-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .form-group {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: space-between;
      }

      mat-form-field {
        width: 100%;
        max-width: 48%;
      }

      .submit-button {
        margin-top: 20px;
        width: 200px;
        align-self: center;
      }

      @media (max-width: 768px) {
        mat-form-field {
          max-width: 100%;
        }
      }
    `
  ]
})
export class PopupComponent {
  constructor(
    private myService: MonthlyDataService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Avrech
  ) {}

  selectedAvrech!: Avrech;

  ngOnInit(): void {
    if (this.data) {
      this.selectedAvrech = this.data;
    }
  }
  
  close(): void {
    this.dialogRef.close();
  }

  replaceSpacesWithUnderscore(input: string): string {
    return input.replace(/\s+/g, '_');
  }

  saveAvrech(): void {
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
    if (this.selectedAvrech) {
      this.selectedAvrech.datot = this.replaceSpacesWithUnderscore(this.selectedAvrech.datot);
      this.selectedAvrech.status = this.replaceSpacesWithUnderscore(this.selectedAvrech.status);

      this.myService.updateAvrech(this.selectedAvrech).subscribe(
        () => {
          console.log('Avrech updated successfully');
          this.dialogRef.close(); // סגירת הדיאלוג לאחר שמירה
          alert("הפרטים שונו בהצלחה!");
        },
        (error: any) => {
          console.error('Error saving avrech data', error);
          if(error.status === 403){
            alert("אין לך הרשאות לעדכון נתונים")
          }else
          alert("הייתה שגיאה בעדכון הנתונים");
        }
      );
      this.dialogRef.close();
    }
  }
}
