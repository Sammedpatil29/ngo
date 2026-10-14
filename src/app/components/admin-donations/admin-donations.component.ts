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

  // Subscriptions Modal State
  showSubscriptionsModal: boolean = false;
  isLoadingSubscriptions: boolean = false;
  subscriptions: any[] = [];
  filteredSubscriptions: any[] = [];
  subscriptionSearchTerm: string = '';
  subscriptionStatusFilter: string = 'all';

  isLoading: boolean = false;

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getDonations();
  }

  openSubscriptionsModal() {
    this.showSubscriptionsModal = true;
    document.body.style.overflow = 'hidden';
    this.fetchSubscriptions();
  }

  closeSubscriptionsModal() {
    this.showSubscriptionsModal = false;
    document.body.style.overflow = '';
  }

  fetchSubscriptions() {
    this.isLoadingSubscriptions = true;
    this.adminService.getSubscriptions().subscribe({
      next: (res: any) => {
        this.isLoadingSubscriptions = false;
        this.subscriptions = (res && res.subscriptions) || [];
        this.applySubscriptionFilters();
      },
      error: (err) => {
        this.isLoadingSubscriptions = false;
        console.error('Error fetching subscriptions:', err);
      }
    });
  }

  applySubscriptionFilters() {
    let list = this.subscriptions;

    // Filter by status dropdown
    if (this.subscriptionStatusFilter !== 'all') {
      list = list.filter(sub => sub.status === this.subscriptionStatusFilter);
    }

    // Filter by search query
    const term = this.subscriptionSearchTerm.toLowerCase().trim();
    if (term) {
      list = list.filter(sub =>
        (sub.id && sub.id.toLowerCase().includes(term)) ||
        (sub.donorName && sub.donorName.toLowerCase().includes(term)) ||
        (sub.email && sub.email.toLowerCase().includes(term)) ||
        (sub.phone && sub.phone.toLowerCase().includes(term)) ||
        (sub.city && sub.city.toLowerCase().includes(term)) ||
        (sub.status && sub.status.toLowerCase().includes(term)) ||
        (sub.planName && sub.planName.toLowerCase().includes(term)) ||
        (sub.amount && sub.amount.toString().includes(term))
      );
    }

    this.filteredSubscriptions = list;
  }

  getStatusBadgeClass(status: string): string {
    switch ((status || '').toLowerCase()) {
      case 'active':
        return 'badge-status-active';
      case 'created':
        return 'badge-status-created';
      case 'authenticated':
        return 'badge-status-authenticated';
      case 'completed':
        return 'badge-status-completed';
      case 'paused':
        return 'badge-status-paused';
      case 'cancelled':
        return 'badge-status-cancelled';
      case 'halted':
        return 'badge-status-halted';
      case 'expired':
        return 'badge-status-expired';
      default:
        return 'badge-status-paused';
    }
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
