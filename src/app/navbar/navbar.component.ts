import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if(this.authService.getUsernameFromToken()=='Admin'){
      this.username = 'מנהל';
    }
    else if(this.authService.getUsernameFromToken()=='Viewer'){
      this.username = 'משרד';
    }
    // this.username = this.authService.getUsernameFromToken();
  }

}