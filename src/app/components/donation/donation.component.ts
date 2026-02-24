import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.css'
})
export class DonationComponent {
  bankDetails = {
    bankName: 'UNION BANK',
    accountName: 'May I Help You Foundation',
    accountNumber: '043711100002944',
    ifscCode: 'UBIN0804371',
    branch: 'Proddatur Main Branch'
  };

  submitDonation(event: Event) {
    event.preventDefault();
    // Logic to handle donation submission or redirect to payment gateway
    alert('Thank you for your interest! Payment gateway integration coming soon.');
  }
}