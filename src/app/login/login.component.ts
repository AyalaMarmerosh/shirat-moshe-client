import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
// import { environment } from '../../environments/environment';

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
    CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false; // משתנה למעקב אחרי מצב הטעינה
  hidePassword: boolean = true;  // ברירת מחדל: הסיסמה מוסתרת

  constructor(private authService: AuthService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;  // מתחלף בין הסתרה להצגה
  }
  // פונקציה לטיפול בלחיצה על התחברות
  onLogin(): void {
    this.isLoading = true; // התחלת טעינה
    console.log(this.username,"שם משתמשn");
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.isLoading = false; // סיום טעינה
        if(response && response.token ){
          console.log("open?");
          this.authService.saveToken(response.token);
          console.log("ההתחברות הצליחה")
          this.router.navigate(['/action']); 
        }else{
          console.error("שגיאה: התגובה מהשרת אינה מכילה את השדה 'token'");
          alert("שגיאה: לא ניתן להתחבר. נסה שוב מאוחר יותר.");
        }
      },
      (error) => {
        this.isLoading = false; // סיום טעינה במקרה של שגיאה
        console.error("שגיאה במהלך ההתחברות:", error);
        alert('שגיאה במהלך ההתחברות');
      }
    );
  }
}
