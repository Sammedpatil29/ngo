import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';

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

  constructor(private router: Router, public adminService: AdminServiceService) {}

  onLogin() {
    let params = {
      email: this.email,
      password: this.password
    }
    this.adminService.login(params).subscribe(
      (response:any) => {
        console.log('Login successful:', response);
        sessionStorage.setItem('adminToken', response?.token);
        this.router.navigate(['/admin-layout']);
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Invalid credentials. Please try again.');
      }
    );
  }

}