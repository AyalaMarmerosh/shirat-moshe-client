import { Component } from '@angular/core';
import { CalculationConfigService } from '../_services/calculation-config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth.service';
import { MatCard, MatCardContent, MatCardFooter, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatChip } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCard, MatCardContent,
    MatFormField, MatLabel,
    MatInputModule, MatIcon, MatExpansionModule, MatCard ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  oldUsername = '';
  newUsername = '';
  newPassword = '';
  message = '';

 constructor(  private configService: CalculationConfigService, private authService: AuthService){}

 updateCredentials() {
  this.authService.updateCredentials(this.oldUsername, this.newUsername, this.newPassword)
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
}
