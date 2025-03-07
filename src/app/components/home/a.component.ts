import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-a',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './a.component.html',
  styleUrl: './a.component.css'
})

export class AComponent {
  constructor(private router: Router) {}

  onStartClick() {
    this.router.navigate(['/register-login']);  // הפנייה לדף ההרשמה
  }
 
}
