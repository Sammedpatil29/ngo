import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonServiceService } from '../../services/common-service.service';
import { LoaderComponent } from "../loader/loader.component";
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ClipboardModule } from '@angular/cdk/clipboard';
import languages from '../../../assets/lang.json';

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
  isLoading: boolean = false;
  languages: any = {};

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

  constructor(
    private commonService: CommonServiceService,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.languages = languages;
  }

  isTestAutoPayNumber(): boolean {
    const cleaned = (this.donation.phone || '').toString().trim().replace(/[^0-9]/g, '');
    return cleaned.endsWith('9591420068');
  }

  ngOnInit(): void {
    this.changedText = this.languages[this.selectedLanguage] || this.languages['english'];
    this.ensureRazorpayScriptLoaded();

    this.route.queryParams.subscribe(params => {
      const lang = params['lang'];
      if (lang && this.languages[lang]) {
        this.selectedLanguage = lang;
        this.changedText = this.languages[this.selectedLanguage];
      } else {
        this.selectedLanguage = 'english';
      }
    });
  }

  ensureRazorpayScriptLoaded(): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof Razorpay !== 'undefined') {
        resolve(true);
        return;
      }
      const existingScript = document.getElementById('razorpay-script');
      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  changeLanguage() {
    this.changedText = this.languages[this.selectedLanguage];
    this.router.navigate([], {
      queryParams: { lang: this.selectedLanguage },
      queryParamsHandling: 'merge'
    });
  }

  async submitDonation(event: Event) {
    event.preventDefault();
    if (!this.donation.amount || parseFloat(this.donation.amount) <= 0) {
      this.showModal('failure', 'Missing Information', 'Please enter a valid donation amount.');
      return;
    }

    this.isLoading = true;
    const scriptLoaded = await this.ensureRazorpayScriptLoaded();
    if (!scriptLoaded) {
      this.isLoading = false;
      this.showModal('failure', 'Network Error', 'Could not load payment gateway. Please check your internet connection.');
      return;
    }

    this.commonService.createDonation(this.donation).subscribe({
      next: (response: any) => {
        this.openRazorpay(response);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error initiating donation order:', error);
        const errMsg = error?.error?.error || 'Something went wrong while initiating donation. Please try again.';
        this.showModal('failure', 'Error', errMsg);
      }
    });
  }

  async submitAutoDonation(event: Event) {
    event.preventDefault();
    if (!this.donation.amount || parseFloat(this.donation.amount) <= 0) {
      this.showModal('failure', 'Missing Information', 'Please enter a valid donation amount.');
      return;
    }

    this.isLoading = true;
    const scriptLoaded = await this.ensureRazorpayScriptLoaded();
    if (!scriptLoaded) {
      this.isLoading = false;
      this.showModal('failure', 'Network Error', 'Could not load payment gateway. Please check your internet connection.');
      return;
    }

    this.commonService.createAutoDonation(this.donation).subscribe({
      next: (response: any) => {
        this.openRazorpayForSubscription(response);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error initiating autopay subscription:', error);
        const errMsg = error?.error?.error || 'Something went wrong while creating recurring donation. Please try again.';
        this.showModal('failure', 'Error', errMsg);
      }
    });
  }

  openRazorpay(orderData: any) {
    const razorpayKey = orderData.keyId || environment.razorpay_id;

    const options = {
      key: razorpayKey,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'May I Help You Foundation',
      description: 'Donation Contribution',
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
        city: this.donation.city,
        isBloodDonor: this.donation.isBloodDonor ? 'Yes' : 'No'
      },
      theme: {
        color: '#d31a70'
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.isLoading = false;
          });
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        this.zone.run(() => {
          this.isLoading = false;
          console.error('Payment failed at checkout:', response.error);
          this.showModal(
            'failure',
            this.changedText?.paymentFailedTitle || 'Payment Failed',
            response?.error?.description || this.changedText?.paymentFailedMessage || 'Your payment could not be processed.'
          );
        });
      });
      rzp.open();
    } catch (e: any) {
      this.isLoading = false;
      console.error('Failed to open Razorpay modal:', e);
      this.showModal('failure', 'Gateway Error', 'Failed to initialize payment gateway.');
    }
  }

  openRazorpayForSubscription(subData: any) {
    const razorpayKey = subData.keyId || environment.razorpay_id;
    const subscriptionId = subData.subscription_id;

    const options = {
      key: razorpayKey,
      subscription_id: subscriptionId,
      name: 'May I Help You Foundation',
      description: 'Monthly Automated Contribution',
      image: '/assets/ngologo.avif',
      handler: (response: any) => {
        this.zone.run(() => {
          const payload = {
            razorpay_payment_id: response?.razorpay_payment_id || response?.payment_id,
            razorpay_subscription_id: response?.razorpay_subscription_id || response?.subscription_id || subscriptionId,
            razorpay_signature: response?.razorpay_signature || response?.signature
          };
          this.verifySignatureOnBackend(payload);
        });
      },
      prefill: {
        name: this.donation.donorName,
        email: this.donation.email,
        contact: this.donation.phone
      },
      notes: {
        city: this.donation.city
      },
      theme: {
        color: '#d31a70'
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.isLoading = false;
          });
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        this.zone.run(() => {
          this.isLoading = false;
          console.error('Subscription mandate authorization failed:', response.error);
          this.showModal(
            'failure',
            this.changedText?.paymentFailedTitle || 'Payment Failed',
            response?.error?.description || this.changedText?.paymentFailedMessage || 'Your subscription mandate could not be processed.'
          );
        });
      });
      rzp.open();
    } catch (e: any) {
      this.isLoading = false;
      console.error('Failed to open Razorpay subscription modal:', e);
      this.showModal('failure', 'Gateway Error', 'Failed to initialize subscription modal.');
    }
  }

  verifyPayment(paymentResponse: any) {
    this.isLoading = true;
    const currentDonorName = this.donation.donorName || 'Generous Supporter';

    this.commonService.verifyPayment(paymentResponse).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.status === 'success') {
          const successMsg = (this.changedText?.paymentSuccessMessage || 'Thank you for your generous donation, ${donorName}!')
            .replace('${donorName}', currentDonorName);
          this.showModal('success', this.changedText?.paymentSuccessTitle || 'Payment Successful!', successMsg);
          this.resetDonationForm();
        } else {
          this.showModal(
            'failure',
            this.changedText?.paymentVerificationFailedTitle || 'Verification Failed',
            response?.message || this.changedText?.paymentVerificationFailedMessage || 'Payment verification failed.'
          );
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Payment verification error:', error);
        this.showModal(
          'failure',
          this.changedText?.paymentVerificationFailedTitle || 'Verification Failed',
          error?.error?.message || this.changedText?.paymentVerificationFailedMessage || 'Payment verification could not be completed.'
        );
      }
    });
  }

  verifySignatureOnBackend(response: any) {
    this.isLoading = true;
    const currentDonorName = this.donation.donorName || 'Generous Supporter';

    this.commonService.verifyCustomSub(response).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res && (res.valid || res.status === 'completed')) {
          const successMsg = (this.changedText?.paymentSuccessMessage || 'Thank you for your monthly support, ${donorName}!')
            .replace('${donorName}', currentDonorName);
          this.showModal('success', this.changedText?.paymentSuccessTitle || 'Subscription Active!', successMsg);
          this.resetDonationForm();
        } else {
          this.showModal(
            'failure',
            this.changedText?.paymentVerificationFailedTitle || 'Verification Failed',
            res?.message || this.changedText?.paymentVerificationFailedMessage || 'Subscription verification failed.'
          );
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error verifying subscription:', err);
        this.showModal(
          'failure',
          this.changedText?.paymentVerificationFailedTitle || 'Verification Failed',
          err?.error?.message || this.changedText?.paymentVerificationFailedMessage || 'Subscription verification failed.'
        );
      }
    });
  }

  resetDonationForm() {
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

  checkPhone(phone: string) {
    if (phone && phone.length === 10) {
      this.isLoading = true;
      this.commonService.donorByPhone(phone).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          if (data) {
            this.donation.donorName = data.donorName || '';
            this.donation.email = data.email || '';
            this.donation.city = data.city || '';
            this.donation.isBloodDonor = data.isBloodDonor || false;
            this.donation.bloodGroup = data.bloodGroup || '';
          }
        },
        error: () => {
          this.isLoading = false;
        }
      });
    }
  }

  gotoHome() {
    this.router.navigate(['/home']);
  }
}