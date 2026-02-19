import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router) {}

  onLogin() {
    // Placeholder logic for demonstration
    console.log('Attempting login with:', this.email, this.password);
    if (this.email === 'admin@gmail.com' && this.password === 'admin123') {
      alert('Login successful!');
      this.router.navigate(['/admin-layout']);
    } else {
      alert('Invalid credentials (Try: admin@ngo.org / admin123)');
    }
  }
}