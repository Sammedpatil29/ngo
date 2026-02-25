import { Component, OnInit, NgZone } from '@angular/core';
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

  showPaymentModal = false;
  paymentStatus: 'success' | 'failure' = 'success';
  paymentTitle = '';
  paymentMessage = '';

  constructor(private commonService: CommonServiceService, private zone: NgZone) { }

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
      this.showModal('failure', 'Missing Information', 'Please enter a donation amount.');
      return;
    }

    this.commonService.createDonation(this.donation).subscribe({
      next: (response: any) => {
        this.openRazorpay(response);
      },
      error: (error) => {
        console.error('Error initiating donation:', error);
        this.showModal('failure', 'Error', 'Something went wrong. Please try again later.');
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
        this.zone.run(() => {
          this.verifyPayment(response);
        });
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
      this.zone.run(() => {
        console.error('Payment failed:', response.error);
        this.showModal('failure', 'Payment Failed', response.error.description);
      });
    });
    rzp.open();
  }

  showModal(status: 'success' | 'failure', title: string, message: string) {
    this.paymentStatus = status;
    this.paymentTitle = title;
    this.paymentMessage = message;
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  verifyPayment(paymentResponse: any) {
    this.commonService.verifyPayment(paymentResponse).subscribe({
      next: (response: any) => {
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
        this.showModal('success', 'Payment Successful!', 'మీ సహాయం మరియు విరాళానికి మేము ఎంతో కృతజ్ఞులము!');
      },
      error: (error) => {
        console.error('Payment verification failed:', error);
        this.showModal('failure', 'Payment Verification Failed', 'Your payment could not be verified. Please contact support.');
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