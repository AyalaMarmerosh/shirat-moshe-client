import { Component } from '@angular/core';
import { NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
// import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { NavbarComponent } from "./navbar/navbar.component";
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent, MatDatepickerModule],
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
