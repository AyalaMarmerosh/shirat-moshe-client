import { Component, Renderer2 } from '@angular/core';
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
  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url === '/add-data' || event.url === '/action' || event.url === '/avrechim-list' || event.url === '/monthly') {
          this.showNavBar = true;
          // הוספת המחלקה דרך Renderer2
          const navElement = document.querySelector('nav');
          if (event.url != '/action') {
            this.renderer.addClass(navElement, 'nav-bar-home');
          } else {
            this.renderer.removeClass(navElement, 'nav-bar-home');
          }
        } else {
          this.showNavBar = false;
        }
      }
    });
  }


  }
