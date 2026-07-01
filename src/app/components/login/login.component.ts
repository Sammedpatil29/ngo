import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  isLoading = false;
  ipAddress = '';
  location: GeolocationCoordinates | null = null;

  constructor(
    private router: Router,
    public adminService: AdminServiceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getDeviceDetails();
  }

  getDeviceDetails() {
    // 1. Get IP Address from a third-party service
    this.http.get<{ ip: string }>('https://api.ipify.org?format=json').subscribe(
      (res) => {
        this.ipAddress = res.ip;
      },
      (err) => {
        console.error('Could not get IP address.', err);
      }
    );

    // 2. Get Geolocation (optional, requires user permission)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.location = position.coords;
        },
        (err) => {
          console.error('User denied location access or error occurred.', err);
        }
      );
    }
  }

  onLogin() {
    this.isLoading = true;
    let params = {
      email: this.email,
      password: this.password,
      ipAddress: this.ipAddress,
      latitude: this.location?.latitude,
      longitude: this.location?.longitude,
    };
    this.adminService.login(params).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        sessionStorage.setItem('adminToken', response?.token);
        this.router.navigate(['/admin-layout']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login failed:', error);
        alert('Invalid credentials. Please try again.');
      },
    });
  }
}