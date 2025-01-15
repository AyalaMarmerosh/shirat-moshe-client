import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('LoginComponent Loaded');
  }

  // פונקציה לטיפול בלחיצה על התחברות
  onLogin(): void {
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
