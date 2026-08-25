import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';
import { LoaderComponent } from "../loader/loader.component";
import { timer, switchMap, tap, takeWhile, finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ClipboardModule } from '@angular/cdk/clipboard';
import  languages  from '../../../assets/lang.json'

declare var Razorpay: any;

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule, LoaderComponent, ClipboardModule],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.css'
})
export class DonationComponent implements OnInit {

  bankDetails = {
    bankName: 'UNION BANK',
    accountName: 'May I Help You Foundation',
    accountNumber: '043711100002944',
    ifscCode: 'UBIN0804371',
    branch: 'Proddatur Main Branch',
    upiId: '62918801@ubin'
  };

  selectedLanguage: any = 'english';  

  changedText: any;

  isLoading: boolean = false

  languages:any = {}

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

  constructor(private commonService: CommonServiceService, private zone: NgZone, private route: ActivatedRoute, private router: Router) {
    this.languages = languages;
  }

  ngOnInit(): void {
    this.changedText = this.languages[this.selectedLanguage]; // Initialize with default language
    this.loadRazorpayScript();
    this.route.queryParams.subscribe(params => {
      const lang = params['lang'];
      if (lang && this.languages[lang]) {
        this.selectedLanguage = lang;
        this.changedText = this.languages[this.selectedLanguage];
      } else {
        this.selectedLanguage = 'english'; // Default to English if no valid lang param
      }
    });
  }

  loadRazorpayScript() {
    if (!document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      document.body.appendChild(script);
    }
  }

  changeLanguage(){
    this.changedText = this.languages[this.selectedLanguage]
    this.router.navigate([], {
      queryParams: {
        lang: this.selectedLanguage
      },
      queryParamsHandling: 'merge' // 'merge' keeps existing query params, 'preserve' keeps old ones completely, default replaces them
    });
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

  submitAutoDonation(event: Event) {
    event.preventDefault();
    if (!this.donation.amount) {
      this.showModal('failure', 'Missing Information', 'Please enter a donation amount.');
      return;
    }
    this.isLoading = true
    this.commonService.createAutoDonation(this.donation).subscribe({
      next: (response: any) => {
        this.isLoading = false
        this.openRazorpayForSubscription(response.subscription_id);
      },
      error: (error) => {
        this.isLoading = false
        console.error('Error initiating autopay donation:', error);
        this.showModal('failure', 'Error', 'Something went wrong. Please try again later.');
      }
    });
  }

  openRazorpay(orderData: any) {
    const options = {
      key: environment.razorpay_id, // Public Key ID
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'May I Help You Foundation',
      description: 'Donation',
      image: '/assets/ngologo.avif',
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
        this.showModal('failure', this.changedText.paymentFailedTitle, this.changedText.paymentFailedMessage);
        this.isLoading = false;
      });
    });
    rzp.open();
  }

  openRazorpayForSubscription(subscriptionId: string) {
  const options = {
    key: environment.razorpay_id, // Public Key ID
    subscription_id: subscriptionId, // Mandate session identifier
    name: 'May I Help You Foundation',
    description: 'Monthly Automated Contribution',
    image: '/assets/ngologo.avif',
    handler: (response: any) => {
      this.zone.run(() => {
        // Triggered automatically if authorization passes
        this.verifySignatureOnBackend(response);
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
  rzp.open();
}

verifySignatureOnBackend(response:any){
  this.isLoading = true;
 this.commonService.verifyCustomSub(response).subscribe((res:any )=> {
    if(res.status === 'completed'){
      this.isLoading = false;
      const donorName = this.donation.donorName; // Store donor name before clearing
      this.showModal('success', this.changedText.paymentSuccessTitle, this.changedText.paymentSuccessMessage.replace('${donorName}', donorName));
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
    } else {
      this.showModal('failure', this.changedText.paymentVerificationFailedTitle, this.changedText.paymentVerificationFailedMessage);
    }
  },
  err => {
    this.isLoading = false;
    console.error('Error occurred while verifying custom subscription:', err);
    this.showModal('failure', this.changedText.paymentVerificationFailedTitle, this.changedText.paymentVerificationFailedMessage);
  });
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
          this.showModal('success', this.changedText.paymentSuccessTitle, this.changedText.paymentSuccessMessage.replace('${donorName}', this.donation.donorName));
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
          this.showModal('failure', this.changedText.paymentVerificationFailedTitle, this.changedText.paymentVerificationFailedMessage);
        }
      }),
      takeWhile((response: any) => response.status === 'pending' && attempt < MAX_RETRIES, true),
      finalize(() => {
        if (this.isLoading) { // If still loading, it means polling timed out
          this.isLoading = false;
          this.showModal('failure', this.changedText.paymentVerificationTimedOutTitle, this.changedText.paymentVerificationTimedOutMessage);
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

gotoHome(){
  this.router.navigate(['/home'])
}

}