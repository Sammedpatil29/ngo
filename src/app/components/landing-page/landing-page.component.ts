import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  // Navigation links using signals
  navItems = signal(['VOLUNTEERS', 'SERVICES', 'DONATE']);
  
  // Contact info
  contactPhone = signal('+91 90000 00000');
  contactEmail = signal('mayihelpyoufoundationjmd@gmail.com');
}