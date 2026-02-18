import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  contactPhone = signal('+91 90000 00000');
  contactEmail = signal('mayihelpyoufoundationjmd@gmail.com');

}
