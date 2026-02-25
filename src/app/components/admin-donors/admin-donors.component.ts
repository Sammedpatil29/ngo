import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-donors',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-donors.component.html',
  styleUrl: './admin-donors.component.css'
})
export class AdminDonorsComponent implements OnInit {

  donors:any[] = []
  filteredDonors: any[] = [];
  searchTerm: string = '';

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getDonors();
  }

  getDonors() {
    this.adminService.getDonors().subscribe({
      next: (response: any) => {
        this.donors = response;
        this.filteredDonors = response;
      },
      error: (error) => console.error('Error fetching donors:', error)
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredDonors = this.donors.filter(donor => 
      (donor.name && donor.name.toLowerCase().includes(term)) ||
      (donor.city && donor.city.toLowerCase().includes(term)) ||
      (donor.bloodGroup && donor.bloodGroup.toLowerCase().includes(term))
    );
  }
}
