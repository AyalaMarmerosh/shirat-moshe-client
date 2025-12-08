import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  features = [
    {
      title: 'ניהול אברכים',
      description: 'צפייה ועדכון פרטי אברכים במערכת',
      icon: 'people',
      route: '/avrechim-list',
      color: 'primary'
    },
    {
      title: 'הוספת נתונים',
      description: 'הוספת נתונים חדשים למערכת',
      icon: 'add_circle',
      route: '/add-data',
      color: 'accent'
    },
    {
      title: 'דו"ח חודשי',
      description: 'צפייה בדוחות חודשיים',
      icon: 'bar_chart',
      route: '/monthly',
      color: 'warn'
    },
    {
      title: 'הגדרות',
      description: 'הגדרות מערכת',
      icon: 'settings',
      route: '/settings',
      color: 'primary'
    }
  ];

  currentYear = new Date().getFullYear();

  constructor() {}
}
