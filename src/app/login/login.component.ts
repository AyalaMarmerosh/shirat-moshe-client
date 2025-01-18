import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = 'שירת משה';
  password = 'אבא שלי';
  apiUrl = ''; 
  apiUrl99 = 'https://shirat-moshe-server.onrender.com/api/MonthlyData/login';
  testUrl = 'https://mail.google.com/mail/u/0/#inbox';

  // apiUrl = environment.apiUrl;
  constructor(private authService: AuthService, private router: Router) {  console.log('apiUrl בקונסטרקטור:', this.apiUrl99);  }

  ngOnInit(): void {
    console.log('LoginComponent Loaded');
    this.apiUrl = 'https://shirat-moshe-server.onrender.com/api/MonthlyData/login';
    console.log('הערך של apiUrl1 בקומפוננטה:', this.authService.apiUrl1);
    console.log('הערך של apiUrl1 כאן!!!:', this.apiUrl);
    console.log('שם משתמש וססמה:', this.username, this.password);
    console.log('זה המייל שלי:', this.testUrl);
    setTimeout(() => {
      console.log('הערך של apiUrl אחרי 8 שניות:', this.apiUrl);
    }, 8000);
    setTimeout(() => {
      console.log('הערך של apiUrl אחרי 8 שניות:', this.apiUrl99);
    }, 8000);
  }

  // פונקציה לטיפול בלחיצה על התחברות
  onLogin(): void {
    console.log(this.username,"שם משתמשn");
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
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
        console.error("שגיאה במהלך ההתחברות:", error);
        alert('Invalid credentials');
      }
    );
  }
}
