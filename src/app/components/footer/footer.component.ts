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
    console.log('Navigating to login page');
    this.router.navigate(['/login']);
  }

  openDocs(type: string) {
    const currentDomain = window.location.origin;
    let url = '';
    switch(type) {
      case 'terms': 
        url = `${currentDomain}/docs?type=terms`;
        break;
      case 'privacy-policy':
        url = `${currentDomain}/docs?type=privacy-policy`;
        break;
      case 'cancellation':
        url = `${currentDomain}/docs?type=cancellation`;
        break;
      default:
        url = `${currentDomain}/docs?type=terms`;
        return;
    }
    window.open(url, '_blank');
    
  }

}
