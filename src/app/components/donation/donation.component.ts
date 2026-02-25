import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';

declare var Razorpay: any;

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.css'
})
export class DonationComponent implements OnInit {
  bankDetails = {
    bankName: 'UNION BANK',
    accountName: 'May I Help You Foundation',
    accountNumber: '043711100002944',
    ifscCode: 'UBIN0804371',
    branch: 'Proddatur Main Branch'
  };

  donation = {
    donorName: "",
    email: "",
    phone: "",
    city: "",
    amount: '',
    currency: "INR",
    message: "",
    transactionId: "",
    paymentStatus: "pending",
    isBloodDonor: false,
    bloodGroup: ""
  };

  constructor(private commonService: CommonServiceService) { }

  ngOnInit(): void {
    this.loadRazorpayScript();
  }

  loadRazorpayScript() {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
    }
  }

  submitDonation(event: Event) {
    event.preventDefault();
    if (!this.donation.amount) {
      alert('Please enter donation amount');
      return;
    }

    this.commonService.createDonation(this.donation).subscribe({
      next: (response: any) => {
        this.openRazorpay(response);
      },
      error: (error) => {
        console.error('Error initiating donation:', error);
        alert('Something went wrong. Please try again later.');
      }
    });
  }

  openRazorpay(orderData: any) {
    const options = {
      key: 'rzp_test_S5RLYqr6y2I6xs',
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'May I Help You Foundation',
      description: 'Donation',
      image: '/assets/logo.png',
      order_id: orderData.orderId,
      handler: (response: any) => {
        // this.verifyPayment(orderData.orderId);
        this.donation.donorName = '';
        this.donation.email = '';
        this.donation.phone = '';
        this.donation.city = '';
        this.donation.amount = '';
        this.donation.message = '';
        this.donation.isBloodDonor = false;
        this.donation.bloodGroup = '';
        alert('Payment Successful! Thank you for your support.');
      },
      prefill: {
        name: this.donation.donorName,
        email: this.donation.email,
        contact: this.donation.phone
      },
      notes: {
        address: this.donation.city
      },
      theme: {
        color: '#d31a70'
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      alert('Payment Failed: ' + response.error.description);
    });
    rzp.open();
  }

  verifyPayment(paymentResponse: any) {
    this.commonService.verifyPayment(paymentResponse).subscribe({
      next: (response: any) => {
        alert('Payment Successful! Thank you for your support.');
        this.donation = {
          donorName: "",
          email: "",
          phone: '',
          city: '',
          amount: '',
          currency: "INR",
          message: "",
          transactionId: "",
          paymentStatus: "pending",
          isBloodDonor: false,
          bloodGroup: ""
        };
      },
      error: (error) => {
        console.error('Payment verification failed:', error);
        alert('Payment verification failed. Please contact support.');
      }
    });
  }

  checkPhone(phone: string) {
  if (phone.length === 10) {
    this.commonService.donorByPhone(phone).subscribe({
      next: (data: any) => {
        if (data) {
          this.donation.donorName = data.donorName || '';
          this.donation.email = data.email || '';
          this.donation.city = data.city || '';
          this.donation.isBloodDonor = data.isBloodDonor || false;
          this.donation.bloodGroup = data.bloodGroup || '';
          this.donation.amount = data.amount || '';
        }
      },
      error: (err) => {
        console.log('Donor not found or error:', err);
        this.donation.donorName =  '';
          this.donation.email = '';
          this.donation.city = '';
          this.donation.isBloodDonor = false;
          this.donation.bloodGroup = '';
          this.donation.amount = '';
      }
    });
  }
}

}