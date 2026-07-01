import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';
import { LoaderComponent } from "../loader/loader.component";
import { timer, switchMap, tap, takeWhile, finalize } from 'rxjs';

declare var Razorpay: any;

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule, LoaderComponent],
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

  isLoading: boolean = false

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
    this.isLoading = true
    this.commonService.createDonation(this.donation).subscribe({
      next: (response: any) => {
        this.openRazorpay(response);
      },
      error: (error) => {
        this.isLoading = false
        console.error('Error initiating donation:', error);
        this.showModal('failure', 'Error', 'Something went wrong. Please try again later.');
      }
    });
  }

  openRazorpay(orderData: any) {
    const options = {
      key: 'rzp_live_T7pd8t1TXmAhLL',
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
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.isLoading = false;
            console.log('User closed the Razorpay modal');
          });
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      this.zone.run(() => {
        console.error('Payment failed:', response.error);
        this.showModal('failure', 'Payment Failed', response.error.description);
        this.isLoading = false;
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
     this.isLoading = true;

    const MAX_RETRIES = 5;
    const RETRY_INTERVAL_MS = 3000; // 3 seconds

    let attempt = 0;

    timer(0, RETRY_INTERVAL_MS).pipe(
      tap(() => attempt++),
      switchMap(() => this.commonService.verifyPayment(paymentResponse)),
      tap((response: any) => {
        // Assuming the response has a 'status' field, e.g., { status: 'success' | 'failure' | 'pending' }
        if (response.status === 'success') {
          this.isLoading = false;
          this.showModal('success', 'Payment Successful!', `Dear ${this.donation.donorName}, మీ సహాయం మరియు విరాళానికి మేము ఎంతో కృతజ్ఞులము!`);
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
        } else if (response.status === 'failure') {
          this.isLoading = false;
          console.error('Payment verification failed with status: failure', response);
          this.showModal('failure', 'Payment Verification Failed', 'Your payment could not be verified. Please contact support.');
        }
      }),
      takeWhile((response: any) => response.status === 'pending' && attempt < MAX_RETRIES, true),
      finalize(() => {
        if (this.isLoading) { // If still loading, it means polling timed out
          this.isLoading = false;
          this.showModal('failure', 'Payment Verification Timed Out', 'We could not confirm your payment status. Please contact support.');
        }
      })
    ).subscribe();
  }

  checkPhone(phone: string) {
  if (phone.length === 10) {
    this.isLoading = true
    this.commonService.donorByPhone(phone).subscribe({
      next: (data: any) => {
        this.isLoading = false
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
        this.isLoading = false
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