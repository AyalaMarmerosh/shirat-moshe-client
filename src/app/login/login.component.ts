import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [    
    MatFormFieldModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  errorMessage = ''; // הוסף את השדה החסר
  hidePassword: boolean = true;

  constructor(private authService: AuthService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage = "אנא הזן שם משתמש וסיסמה";
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; // נקה את ההודעה הקודמת
    console.log(this.username,"שם משתמשn");
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.isLoading = false;
        if(response && response.token ){
          console.log("open?");
          this.authService.saveToken(response.token);
          console.log("ההתחברות הצליחה")
          // נווט ל-action בעיכוב קטן
          setTimeout(() => {
            this.router.navigate(['/action']);
          }, 100);
        }else{
          this.errorMessage = "שגיאה: לא ניתן להתחבר. נסה שוב מאוחר יותר.";
          console.error("שגיאה: התגובה מהשרת אינה מכילה את השדה 'token'");
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = "שגיאה במהלך ההתחברות. בדוק את הפרטים שלך.";
        console.error("שגיאה במהלך ההתחברות:", error);
      }
    );
  }
}
