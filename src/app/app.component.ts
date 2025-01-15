import { Component } from '@angular/core';
import { NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AvrechComponent } from "./avrech/avrech.component";
import { LoginComponent } from './login/login.component';
import { AuthService } from './_services/auth.service';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { NavbarComponent } from "./navbar/navbar.component";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_services/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, LoginComponent, NavbarComponent, MatDatepickerModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // הגדרה של Interceptor
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'MonthlyDataApp';
  showNavBar = false;


  ngOnInit(): void {
    console.log('AppComponent Loaded');
    console.log('Routes:', routes);  // הדפסת הנתיבים כאן

  }
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/add-data' || event.url === '/action' || event.url === '/avrechim-list' || event.url === '/monthly') {
          this.showNavBar = true;
        } else {
          this.showNavBar = false;
        }
      }
    });
  }


  }
