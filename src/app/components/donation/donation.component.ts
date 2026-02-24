import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';

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

  donation = {
    phone: '',
    name: '',
    email: '',
    city: '',
    donateBlood: false,
    bloodGroup: '',
    amount: '',
    message: ''
  };

  constructor(private commonService: CommonServiceService) { }

  submitDonation(event: Event) {
    event.preventDefault();
    console.log('Donation Data:', this.donation);
    // Logic to handle donation submission or redirect to payment gateway
    alert('Thank you for your interest! Payment gateway integration coming soon.');
  }

  checkPhone(phone: string) {
  if (phone.length === 10) {
    this.commonService.donorByPhone(phone).subscribe({
      next: (data: any) => {
        if (data) {
          this.donation.name = data.donorName || '';
          this.donation.email = data.email || '';
          this.donation.city = data.city || '';
          this.donation.donateBlood = data.isBloodDonor || false;
          this.donation.bloodGroup = data.bloodGroup || '';
          this.donation.amount = data.amount || '';
        }
      },
      error: (err) => {
        console.log('Donor not found or error:', err);
        this.donation.name =  '';
          this.donation.email = '';
          this.donation.city = '';
          this.donation.donateBlood = false;
          this.donation.bloodGroup = '';
          this.donation.amount = '';
      }
    });
  }
}

}