import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    MatDividerModule
  ],
  template: `
    <div class="popup-container">
      <h1 mat-dialog-title>{{ data.abrek.lastName + " " + data.abrek.firstName}}</h1>
      <mat-divider></mat-divider>
      <div mat-dialog-content class="popup-content">
      <p><strong>סטטוס: </strong>{{ data.abrek.status }}</p>

        <div class="abrek-details">

          <div class="detail-item">
            <p><strong>כתובת: </strong>{{ data.abrek.street + " " + data.abrek.houseNumber || "לא רשום"}}</p>
            <!-- <p><strong>מספר: </strong>{{ data.abrek.houseNumber || "לא רשום"}}</p> -->
          <p><strong>בנק: </strong>{{ data.abrek.bank || "לא רשום"}}</p>
            <p><strong>סניף: </strong>{{ data.abrek.branch || "לא רשום"}}</p>
            <p><strong>מספר חשבון: </strong>{{ data.abrek.accountNumber || "לא רשום"}}</p>
        </div>
          <div class="detail-item">
            <p><strong>תעודת זהות: </strong> {{ data.abrek.teudatZeut || "לא רשום"}}</p>
            <p><strong>תאריך לידה: </strong>{{ formatDate(data.abrek.dateOfBirth) || "לא רשום"}}</p>
            <p><strong>טלפון: </strong>{{ data.abrek.phone || "לא רשום"}}</p>
            <p><strong>פלאפון: </strong>{{ data.abrek.cellPhone || "לא רשום"}}</p>
            <p><strong>פלאפון 2: </strong>{{ data.abrek.cellPhone2 || "לא רשום"}}</p>
          </div>

      </div>
      <mat-divider></mat-divider>
      <div mat-dialog-actions class="popup-actions">
        <button mat-raised-button color="primary" (click)="close()">סגור</button>
      </div>
    </div>
  `,
  styles: [
    `
      .popup-container {
        text-align: center;
        padding: 20px;
        font-family: 'Arial', sans-serif;
        max-width: 600px;
      }

      h1 {
        margin-bottom: 10px;
        font-size: 24px;
        color: #0369a1;
      }

      mat-dialog-content {
        padding: 15px 10px;
        font-size: 16px;
        color: #555;
      }

      mat-dialog-content p {
        margin: 10px 0;
      }

      mat-divider {
        margin: 10px 0;
      }

      .popup-actions {
        display: flex;
        justify-content: center;
        margin-top: 15px;
      }

      button {
        background-color: #ffd740;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 14px;
      }

      .abrek-details {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-top: 10px;
      }

      .detail-item {
        width: 48%; /* כל עמודה תשתלט על 48% מהמרחב */
        margin-bottom: 20px;
      }

      .detail-item p {
        font-size: 14px;
      }

      .detail-item strong {
        font-weight: bold;
      }
    `
  ]
})
export class PopupComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
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
}
