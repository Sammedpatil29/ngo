import { Component, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements AfterViewInit, OnDestroy {

  sidebarOpen = false;
  logoutConfirmVisible = false;

  constructor(private router: Router) { }

  ngAfterViewInit(): void {
    // this.addGoogleTranslateScript();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeSidebar();
  }

  addGoogleTranslateScript() {
    // Avoid adding the script multiple times
    if (document.getElementById('google-translate-script')) {
      return;
    }

    // 1. Define the callback function that Google's script will call
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en', // Set your site's default language
        includedLanguages: 'te,en', // Only show Telugu and English
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    };

    // 2. Create and add the script element to the document's body
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
  }

  showLogoutConfirm(): void {
    this.logoutConfirmVisible = true;
  }

  cancelLogout(): void {
    this.logoutConfirmVisible = false;
  }

  logOut() {
    this.logoutConfirmVisible = false;
    sessionStorage.removeItem('adminToken');
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    // Clean up the script and the widget when the component is destroyed
    // to avoid issues with Hot Module Replacement (HMR) during development.
    const script = document.getElementById('google-translate-script');
    if (script) {
      script.remove();
    }
    const widget = document.querySelector('.skiptranslate');
    if (widget) {
      widget.remove();
    }
    // Remove the Google Translate cookie to reset the language on component destruction
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    delete (window as any).googleTranslateElementInit;
  }
}
