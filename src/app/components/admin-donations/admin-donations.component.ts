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

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredDonations = this.donations.filter(donation =>
      (donation.donorName && donation.donorName.toLowerCase().includes(term)) ||
      (donation.city && donation.city.toLowerCase().includes(term)) ||
      (donation.amount && donation.amount.toString().includes(term)) ||
      (donation.paymentStatus && donation.paymentStatus.toLowerCase().includes(term)) ||
      (donation.transactionId && donation.transactionId.toLowerCase().includes(term)) ||
      (donation.phone && donation.phone.toLowerCase().includes(term)) 
    );
  }
}
