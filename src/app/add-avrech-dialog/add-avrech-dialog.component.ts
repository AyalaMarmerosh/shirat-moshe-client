import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MonthlyDataService } from '../_services/monthly-data.service';
import { AuthService } from '../_services/auth.service';
// import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-add-avrech-dialog',
  standalone: true,
    imports: [MatDialogModule, MatFormFieldModule, MatOption, MatSelect, FormsModule, MatInputModule],
  templateUrl: './add-avrech-dialog.component.html',
  styleUrls: ['./add-avrech-dialog.component.css']
})
export class AddAvrechDialogComponent {
  newAvrech = {
    firstName: '',
    lastName: '',
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
    status: 0,
    datot: 0,
    isPresent: ''
  };
  message = '';


  constructor(private serv: MonthlyDataService, public dialogRef: MatDialogRef<AddAvrechDialogComponent>,     private authService: AuthService,
      private snackBar: MatSnackBar) {}

  saveNewAvrech() {
        // בדיקה אם המשתמש לא מורשה להוסיף נתונים
        if (this.authService.getUsernameFromToken()=='Viewer') {
          this.snackBar.open('אין לך הרשאות להוסיף נתונים', 'סגור', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'] // עיצוב ייחודי להודעת שגיאה
          });
          return; // עוצר את שמירת הנתונים
        }
    this.newAvrech.status = Number(this.newAvrech.status);
    this.newAvrech.datot = Number(this.newAvrech.datot);
    if (this.newAvrech.firstName && this.newAvrech.lastName && this.newAvrech.teudatZeut) {
      console.log('אברך חדש:', this.newAvrech);

     this.serv.addAvrech(this.newAvrech).subscribe(
      (response) => {
        alert("אברך נוסף בהצלחה!");
        this.message = 'אברך נוסף בהצלחה';
        console.log(response);
      },
      (error) => {
        console.log("רררררררררררר",error,"SSSSSSS",error.status);
        if( error.status === 403 ){
          alert('אין לך הרשאה לפעולה זו');
        }
        this.message = error;
        console.log(error);
      }
     )      // סגור את הפופ-אפ
      this.dialogRef.close();
    } else {
      alert('אנא מלא את כל השדות הדרושים');
    }
  }
}
