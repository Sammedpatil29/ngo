import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  contactPhone = signal('+91 82972 53484');
  contactEmail = signal('mayihelpyoufoundationjmd@gmail.com');
  year = new Date().getFullYear();

  constructor(private router: Router){}

  login(){
    this.router.navigate(['/login']);
  }

}
