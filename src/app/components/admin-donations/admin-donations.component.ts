import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-donations',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-donations.component.html',
  styleUrl: './admin-donations.component.css'
})
export class AdminDonationsComponent implements OnInit {

  donations: any[] = [];
  filteredDonations: any[] = [];
  searchTerm: string = '';

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getDonations();
  }

  getDonations() {
    this.adminService.getDonations().subscribe({
      next: (response: any) => {
        this.donations = response;
        this.filteredDonations = response;
      },
      error: (error) => console.error('Error fetching donations:', error)
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
