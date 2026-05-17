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
import { InsertOneDataComponent } from './insertOneDataPopup.component'
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../_services/auth.service';
import { AddDataComponent } from '../add-data/add-data.component';
import { MonthlyDraftService } from '../_services/MonthlyDraft.service';

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
    // 'remove',
    'edit',
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
    'notes'
  ];
  selectedMonth: string = '';
  selectedYear: string = '';
  searchName: string = '';
  totalOrElchanan: number = 0;
  totalAddAmount: number = 0;
  totalBase: number = 0;
  totalAmount: number = 0;
  totalDatot: number = 0;
  totalGinusar: number = 0;
  isLoading = false; // משתנה למעקב אחרי מצב הטעינה
  editingIndex: number | null = null; // משתנה למעקב אחרי השורה המהווה מצב עריכה


  
  constructor(private myService: MonthlyDataService, private snackBar: MatSnackBar, private dialog: MatDialog, private authService: AuthService,     private draftService: MonthlyDraftService
  ){}

  ngOnInit(): void {
    this.getRecords();
  }

//   getRecords(){
//     this.isLoading = true;
//     this.myService.getAvrechim(1, 100).subscribe(avrechimData => {  
//       this.avrechim = avrechimData.avrechim; // שמירת האברכים בזיכרון

//     this.myService.getRecords(this.selectedYear, this.selectedMonth).subscribe((data) => {
//       this.isLoading = false; // סיום טעינה
//       console.log("nvnvnv", data);
//   //     const hebrewMonthsOrder = [
//   //       'תשרי', 'חשון','חשוון', 'כסליו', 'טבת', 'שבט', 'אדר', 'אדר א', 'אדר ב',
//   //       'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'
//   //     ];

//   //     this.records = data
//   //     .filter(rec => this.searchName ? this.getAvrechName(rec.personId).includes(this.searchName) : true)
//   //     .filter(rec => rec.year !== 'Default')
//   //     .map(rec => ({
//   //       ...rec,
//   //       avrechName: this.getAvrechName(rec.personId) // הוספת שם האברך לכל רשומה
//   //     }))
//   // .sort((a, b) => {
//   //       const yearCompare = b.year.localeCompare(a.year);
//   //         if (yearCompare !== 0) return yearCompare;

//   //         const aMonthIndex = hebrewMonthsOrder.indexOf(a.month);
//   //         const bMonthIndex = hebrewMonthsOrder.indexOf(b.month);
//   //         if (aMonthIndex !== bMonthIndex) return bMonthIndex - aMonthIndex;

//   //         return a.avrechName.localeCompare(b.avrechName, 'he');
//   //       });

//   const hebrewMonthsOrder = [
//   'תשרי', 'חשון', 'כסליו', 'טבת', 'שבט', 'אדר', 'אדר א', 'אדר ב',
//   'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'
// ];

// this.records = data
//   .filter(rec => this.searchName ? this.getAvrechName(rec.personId).includes(this.searchName) : true)
//   .filter(rec => rec.year !== 'Default')
//   .map(rec => ({
//     ...rec,
//     avrechName: this.getAvrechName(rec.personId)
//   }))
//   .sort((a, b) => {
//     // מיון שנה – מהגדול לקטן
//     const yearCompare = b.year.localeCompare(a.year);
//     if (yearCompare !== 0) return yearCompare;

//     // מיון חודש לפי אינדקס תקין
//     const aMonthIndex = hebrewMonthsOrder.indexOf(a.month);
//     const bMonthIndex = hebrewMonthsOrder.indexOf(b.month);

//     return bMonthIndex - aMonthIndex;
//   });

//     }, error => {
//       this.isLoading = false;
//       alert("יש שגיאה בטעינת הנתונים");
//     });
//   });
// }


getRecords(){
  this.isLoading = true;
  this.myService.getAvrechim(1, 100).subscribe(avrechimData => {
    this.avrechim = avrechimData.avrechim;

    this.myService.getRecords(this.selectedYear, this.selectedMonth).subscribe(data => {
      this.isLoading = false;

      // מיפוי חודש עברי תקני (ערכים נומרליים לכל וריאציה נפוצה)
      const monthOrderMap = new Map<string, number>([
        ['תשרי', 0],
        ['חשון', 1],
        ['חשוון', 1],
        ['כסלו', 2],
        ['טבת', 3],
        ['שבט', 4],
        ['אדר', 5],      // במקרה של שנה פשוטה
        ['אדר א', 5],    // אדר א
        ['אדר ב', 6],    // אדר ב (שנה מעוברת)
        ['ניסן', 7],
        ['אייר', 8],
        ['סיון', 9],
        ['תמוז', 10],
        ['אב', 11],
        ['אלול', 12]
      ]);

      // נורמליזציה: הסרת רווחים מיותרים, המרת אותיות זהות, ועיבוד וריאציות נפוצות
      const normalizeMonth = (m: string | null | undefined): string => {
        if (!m) return '';
        let s = m.trim();

        // החלפות נפוצות
        s = s.replace(/\u05BC/g, ''); // הסרת ניקוד שיכול להפריע (אם קיים)
        s = s.replace(/ח\s*ש\s*ו\s*ן/gi, 'חשוון'); // דוגמא - פחות סביר, רק למקרה
        s = s.replace(/\s+/g, ' '); // רווחים מרובים -> אחד

        // סטנדרט: המרת חשוון ל'חשון' (או לשם שאת רוצה בתצוגה)
        if (s === 'חשוון' || s === 'חשוֹן') s = 'חשון';

        // המרת אדר בלי פירוט לאדר א (שיטת מיפוי שלנו)
        if (s === 'אדר') {
          // נשאיר 'אדר' ככזה — מיפוי למיקום קיים (5)
          // אם את רוצה לכריע לפי האם השנה מעוברת, צריך לבדוק זאת בנפרד
        }

        // הפוך לכל אותיות רגילות (אם יש תווים מיוחדים)
        s = s.replace(/[^\u0590-\u05FF\s0-9א-ת]/g, '');

        return s;
      };

      // ממפה ומנרמלת את הנתונים לפני המיון
      const prepared = data
        .filter(rec => this.searchName ? this.getAvrechName(rec.personId).includes(this.searchName) : true)
        .filter(rec => rec.year !== 'Default')
        .map(rec => {
          const normalizedMonth = normalizeMonth(rec.month);
          return {
            ...rec,
            monthNormalized: normalizedMonth,
            avrechName: this.getAvrechName(rec.personId)
          };
        });

      // פונקציית עזר שמחזירה אינדקס מ־monthOrderMap; אם לא נמצא -> -100 (קטן מאוד)
      const monthIndex = (monthStr: string) => {
        if (!monthStr) return -100;
        const key = monthStr;
        if (monthOrderMap.has(key)) return monthOrderMap.get(key)!;
        // נסי לבדוק גם וריאציות קטנות (למשל ללא מרווחים)
        const collapsed = key.replace(/\s+/g, ' ').trim();
        if (monthOrderMap.has(collapsed)) return monthOrderMap.get(collapsed)!;
        // אפשר להוסיף עוד בדיקות אם יש וריאציות מיוחדות
        return -100; // לא מזוהה -> ייקבע כ'נמוך' כדי שלא יפריע למיון הרגיל
      };

      // המיון: שנה יורדת (החדש קודם), בתוך שנה חודש בסדר יורד (מהסוף להתחלה), ואז שם
      this.records = prepared.sort((a, b) => {
        // ננסה להשוות שנה בצורה יציבה — אם השנים מיוצגות כטקסט עברי כמו 'תשפ"ה', נשתמש ב־localeCompare הפשוט
        const yearCompare = b.year.localeCompare(a.year, 'he');
        if (yearCompare !== 0) return yearCompare;

        const idxA = monthIndex(a.monthNormalized);
        const idxB = monthIndex(b.monthNormalized);
        if (idxA !== idxB) return idxB - idxA; // סדר יורד לפי אינדקס (גבוה -> נמוך)

        // ברירת מחדל: שמות עבריים בסדר לפי עברית
        return a.avrechName.localeCompare(b.avrechName, 'he');
      });

    }, error => {
      this.isLoading = false;
      alert("יש שגיאה בטעינת הנתונים");
      console.error(error);
    });
  });
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

getTotalOrGinusar(): number {
  return this.records.reduce((sum, record) => sum + (record.ginusar || 0), 0);
}
getTotalAddAmount(): number {
  return this.records.reduce((sum, record) => sum + (record.addAmount || 0), 0);
}

isEditing(index: number): boolean {
  return this.editingIndex === index;
}

// פונקציה שמבצעת את ההפעלה לעריכת שורה
editRow(index: number): void {
      // בדיקה אם המשתמש לא מורשה להוסיף נתונים
      if (this.authService.getUsernameFromToken()=='Viewer') {
        this.snackBar.open('אין לך הרשאות לערוך נתונים', 'סגור', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'] // עיצוב ייחודי להודעת שגיאה
        });
        return; // עוצר את שמירת הנתונים
      }
  console.log("ID", this.records)
  this.editingIndex = index; // קובעים שהשורה בתהליך עריכה
}


saveRow(record: MonthlyRecord): void {
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
      if( error.status === 403 ){
        this.snackBar.open('אין לך הרשאות לערוך נתונים', 'סגור', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['conflict-snackbar']
        });
      }else
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

deleteData(id: number): void {
      // בדיקה אם המשתמש לא מורשה להוסיף נתונים
      if (this.authService.getUsernameFromToken()=='Viewer') {
        this.snackBar.open('אין לך הרשאות למחוק נתונים', 'סגור', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar'] // עיצוב ייחודי להודעת שגיאה
        });
        return; // עוצר את שמירת הנתונים
      }
  if (confirm('האם אתה בטוח שברצונך למחוק את הנתון הזה?')) {
    this.myService.deleteData(id).subscribe(
      () => {
        this.getRecords();
      },
      (error) => {
        console.error('Error deleting data', error);
        if( error.status === 403 ){
          this.snackBar.open('אין לך הרשאות למחוק נתונים', 'סגור', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['conflict-snackbar']
          });
      } else {
        this.snackBar.open('אירעה שגיאה.', 'סגור', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    }
    );
  }
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

saveDraftState() {
  this.draftService.saveDraft({
    records: this.records,
    selectedMonth: this.selectedMonth,
    selectedYear: this.selectedYear
  });
}

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

openPopup(): void {
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
  const dialogRef = this.dialog.open(InsertOneDataComponent, {
    width: '500px',
    height: '500px',
    data: {} // ניתן להעביר כאן נתונים לפי הצורך
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('Popup closed', result);
    this.getRecords();
  });
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

    const filePath = 'assets/template.xlsx'; // נתיב לקובץ התבנית
    fetch(filePath).then(response => response.arrayBuffer()).then(data => {
      const wb: XLSX.WorkBook = XLSX.read(data, { type: 'array' });
      const ws: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[0]]; // לוקח את הגיליון הראשון
      
      const headers = [
        'שם', 'חודש', 'שנה', 'מלגת בסיס', 'חבורה', 'מבחן', 'סכום סופי', 'דתות', 'אור אלחנן', 'יתרה', 'פירות גינוסר', 'הערה'
      ];
      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });

      headers.forEach((header, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index }); // כתובת התא (A1, B1 וכו')
        if (!ws[cellAddress]) return;
        ws[cellAddress].s = { font: { bold: true } }; // הופך את הטקסט למודגש
      });

      
      // מיפוי הנתונים בפורמט עברי
      const mappedRecords = this.records.map(record => ({
        'שם': this.getAvrechName(record.personId),
        'חודש': record.month,
        'שנה': record.year,
        'מלגת בסיס': record.baseAllowance,
        'חבורה': record.isChabura ? '300' : '',
        'מבחן': record.didLargeTest ? '500' : '',
        'סכום סופי': record.totalAmount,
        'דתות': record.datot,
        'אור אלחנן': record.orElchanan,
        'יתרה': record.addAmount,
        'פירות גינוסר': record.ginusar,
        'הערה': record.notes
      }));
  

      // הוספת הנתונים לגיליון מהשורה השנייה
      XLSX.utils.sheet_add_json(ws, mappedRecords, { origin: "A2", skipHeader: true });
  
      ws['!cols'] = [
        { wch: 15 }, // שם
        { wch: 10 }, // חודש
        { wch: 10 }, // שנה
        { wch: 15 }, // מלגת בסיס
        { wch: 10 }, // חבורה
        { wch: 10 }, // מבחן
        { wch: 15 }, // סכום סופי
        { wch: 10 }, // דתות
        { wch: 15 }, // אור אלחנן
        { wch: 10 }, // יתרה
        { wch: 10 }, // פירות גינוסר
        { wch: 20 }  // הערה
      ];

      // שמירת הקובץ
      XLSX.writeFile(wb, 'נתונים חודשיים להורדה.xlsx');
    });  
  }
}
