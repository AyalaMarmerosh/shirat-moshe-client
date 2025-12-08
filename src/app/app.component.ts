import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { NavigationStart, Router, RouterModule, RouterOutlet } from '@angular/router';
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
  showNavBar = false;  // ✅ שנה ל-false כי בהתחלה המשתמש לא מחובר

  ngOnInit(): void {
    console.log('AppComponent Loaded');
    console.log('Routes:', routes);
  }

  constructor(private router: Router, private renderer: Renderer2) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const navUrls = ['/add-data', '/action', '/avrechim-list', '/monthly', '/settings'];
        
        if (navUrls.includes(event.url)) {
          this.showNavBar = true;
          setTimeout(() => {
            const navElement = document.querySelector('nav');
            if (navElement) {
              if (event.url !== '/action') {
                this.renderer.addClass(navElement, 'nav-bar-home');
              } else {
                this.renderer.removeClass(navElement, 'nav-bar-home');
              }
            }
          }, 0);
        } else {
          this.showNavBar = false;
        }
      }
    });
  }
}
