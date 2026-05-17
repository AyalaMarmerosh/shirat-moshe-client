import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MonthlyRecord } from '../_models/MonthlyRecord';

@Component({
  selector: 'app-edit-monthly-record',
  standalone: true,
  imports: [],
  templateUrl: './edit-monthly-record.component.html',
  styleUrl: './edit-monthly-record.component.css'
})
export class EditMonthlyRecordComponent {

 record: MonthlyRecord;

  constructor(
    private dialogRef: MatDialogRef<EditMonthlyRecordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.record = { ...data.record };
  }

  save() {
    this.dialogRef.close(this.record);
  }

  cancel() {
    this.dialogRef.close();
  }
}
