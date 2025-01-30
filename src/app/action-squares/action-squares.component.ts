import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-action-squares',
  standalone: true,
  imports: [FormsModule, MatIconModule],
  templateUrl: './action-squares.component.html',
  styleUrl: './action-squares.component.css'
})
export class ActionSquaresComponent {
  constructor(private router: Router) {}

  @ViewChild('contactSection') contactSection!: ElementRef;

  scrollToBottom() {
    this.contactSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  goToAvrekimList() {
    this.router.navigate(['/avrechim-list']);  // הנתיב לעמוד רשימת האברכים
  }

  goToAddData() {
    this.router.navigate(['/add-data']);  // הנתיב לעמוד הוספת נתונים
  }
}
