import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  contactPhone = signal('+91 82972 53484');
  contactEmail = signal('mayihelpyoufoundationjmd@gmail.com');
  year = new Date().getFullYear();
  isLoggedIn = signal(false);

  constructor(private router: Router){}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      this.isLoggedIn.set(!!sessionStorage.getItem('adminToken'));
    }
  }

  login(){
    console.log('Navigating from footer');
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' && sessionStorage.getItem('adminToken')) {
      this.router.navigate(['/admin-layout']);
    } else {
      this.router.navigate(['/login']);
    }
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
