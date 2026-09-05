import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-admin-donations',
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './admin-donations.component.html',
  styleUrl: './admin-donations.component.css'
})
export class AdminDonationsComponent implements OnInit {

  donations: any[] = [];
  donationsRes: any;
  filteredDonations: any[] = [];
  searchTerm: string = '';
  activeSubscriptionsCount: any = { count: 0, total: 0 };
  metrics = {
    today: { amount: 0, count: 0 },
    week: { amount: 0, count: 0 },
    month: { amount: 0, count: 0 },
    year: { amount: 0, count: 0 }
  };

  

  isLoading: boolean = false

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getDonations();
  }

  getDonations() {
    this.isLoading = true
    this.adminService.getDonations().subscribe({
      next: (response: any) => {
        this.isLoading = false
        this.donationsRes = response
        this.donations = response.donations;
        this.activeSubscriptionsCount = response.razorpayStats.activeSubscriptions;
        this.filteredDonations = response.donations;
        this.metrics.today.amount = response.razorpayStats.today.total
        this.metrics.today.count = response.razorpayStats.today.count
        this.metrics.week.amount = response.razorpayStats.lastWeek.total
        this.metrics.week.count = response.razorpayStats.lastWeek.count
        this.metrics.month.amount = response.razorpayStats.thisMonth.total
        this.metrics.month.count = response.razorpayStats.thisMonth.count
        this.metrics.year.amount = response.razorpayStats.thisYear.total
        this.metrics.year.count = response.razorpayStats.thisYear.count
      },
      error: (error) => {
        this.isLoading = false
        console.error('Error fetching donations:', error)
      } 
    });
  }

  isAutoPay(donation: any): boolean {
    if (!donation) return false;
    // 1. If mode is present in API data, use it directly
    if (donation.mode) {
      return donation.mode === 'auto';
    }
    // 2. Fallback to old method if mode is not present (legacy records)
    if (donation.transactionId && (donation.transactionId.startsWith('sub_') || donation.transactionId.startsWith('sub-') || donation.transactionId.startsWith('sub'))) {
      return true;
    }
    if (donation.subscriptionId && donation.subscriptionId.trim() !== '') {
      return true;
    }
    if (donation.message && donation.message.toLowerCase().includes('subscription')) {
      return true;
    }
    return false;
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredDonations = this.donations;
      return;
    }
    this.filteredDonations = this.donations.filter(donation => {
      const isAuto = this.isAutoPay(donation);
      const modeMatches = (term === 'auto' || term === 'autopay' || term === 'subscription') ? isAuto :
                          (term === 'one-time' || term === 'onetime' || term === '1-time') ? !isAuto : false;

      return modeMatches ||
        (donation.donorName && donation.donorName.toLowerCase().includes(term)) ||
        (donation.city && donation.city.toLowerCase().includes(term)) ||
        (donation.amount && donation.amount.toString().includes(term)) ||
        (donation.mode && donation.mode.toLowerCase().includes(term)) ||
        (donation.paymentStatus && donation.paymentStatus.toLowerCase().includes(term)) ||
        (donation.transactionId && donation.transactionId.toLowerCase().includes(term)) ||
        (donation.subscriptionId && donation.subscriptionId.toLowerCase().includes(term)) ||
        (donation.phone && donation.phone.toLowerCase().includes(term));
    });
  }
}
