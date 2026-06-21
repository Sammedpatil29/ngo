import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-donor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donor-form.component.html',
  styleUrl: './donor-form.component.css'
})
export class DonorFormComponent {
  donor = {
    name: '',
    email: '',
    phone: '',
    city: '',
    isBloodDonor: false,
    bloodGroup: ''
  };

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  constructor(private adminService: AdminServiceService){}

  submitDonor(event: Event) {
    let params = {
      name: this.donor.name,
      email: this.donor.email,
      phone: this.donor.phone,
      city: this.donor.city,
      isBloodDonor: this.donor.isBloodDonor,
      bloodGroup: this.donor.bloodGroup
    }
    this.adminService.createDonor(params).subscribe((res:any)=>{
      alert('Donor added Successfully✅')
    }, error => {
      alert('error while updating Donor❌')
    })
  }
}
