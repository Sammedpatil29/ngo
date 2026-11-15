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

  // Table Pagination State
  currentPage: number = 1;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  totalDonations: number = 0;
  totalPages: number = 1;
  isTableLoading: boolean = false;
  private searchDebounceTimer: any = null;

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
    this.getDonations(true);
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

  getDonations(includeStats: boolean = true) {
    if (includeStats) {
      this.isLoading = true;
    } else {
      this.isTableLoading = true;
    }

    this.adminService.getDonations(this.currentPage, this.pageSize, this.searchTerm, includeStats).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.isTableLoading = false;
        this.donations = response.donations || [];
        this.filteredDonations = this.donations;

        if (response.pagination) {
          this.totalDonations = response.pagination.total || 0;
          this.currentPage = response.pagination.page || 1;
          this.pageSize = response.pagination.limit || this.pageSize;
          this.totalPages = response.pagination.totalPages || 1;
        } else {
          this.totalDonations = this.donations.length;
          this.totalPages = Math.ceil(this.totalDonations / this.pageSize) || 1;
        }

        if (response.razorpayStats) {
          this.donationsRes = response;
          this.activeSubscriptionsCount = response.razorpayStats.activeSubscriptions;
          this.metrics.today.amount = response.razorpayStats.today.total;
          this.metrics.today.count = response.razorpayStats.today.count;
          this.metrics.week.amount = response.razorpayStats.lastWeek.total;
          this.metrics.week.count = response.razorpayStats.lastWeek.count;
          this.metrics.month.amount = response.razorpayStats.thisMonth.total;
          this.metrics.month.count = response.razorpayStats.thisMonth.count;
          this.metrics.year.amount = response.razorpayStats.thisYear.total;
          this.metrics.year.count = response.razorpayStats.thisYear.count;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.isTableLoading = false;
        console.error('Error fetching donations:', error);
      }
    });
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.getDonations(false);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.currentPage = page;
    this.getDonations(false);
  }

  get startRecord(): number {
    if (this.totalDonations === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalDonations);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
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
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.currentPage = 1;
      this.getDonations(false);
    }, 300);
  }
}
