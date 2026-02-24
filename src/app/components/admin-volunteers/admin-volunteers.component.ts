import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-volunteers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-volunteers.component.html',
  styleUrl: './admin-volunteers.component.css'
})
export class AdminVolunteersComponent implements OnInit {
  
  volunteers: any[] = [];

  showModal = false;
  isEditing = false;
  uploadedImage: any;
  currentVolunteer: any;

  constructor(private adminService: AdminServiceService) {
    
  }

  ngOnInit(): void {
    this.getVolunteers();
  }

  onAdd() {
    this.currentVolunteer = {name: '', role: '', image: '', isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  getVolunteers() {
    this.adminService.getVolunteers().subscribe({
      next: (response: any) => {
        this.volunteers = response;
        console.log(this.volunteers);
      },
      error: (error) => console.error('Error fetching volunteers:', error)
    });
  }

  onEdit(volunteer: any) {
    this.currentVolunteer = { ...volunteer };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.getVolunteers()
  }

  onSave() {
    if (this.isEditing) {
      this.adminService.updateVolunteer(this.currentVolunteer).subscribe({
        next: (response: any) => {
          
          this.closeModal();
        },
        error: (error) => console.error('Error updating volunteer:', error)
      });
    } else {
      this.adminService.addVolunteer(this.currentVolunteer).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error adding volunteer:', error)
      });
    }
  }

  onDelete(volunteer: any) {
    if(confirm(`Are you sure you want to delete ${volunteer.name}?`)) {
      this.adminService.deleteVolunteer(volunteer.id).subscribe({
        next: () => {
          this.volunteers = this.volunteers.filter(v => v.id !== volunteer.id);
        },
        error: (error) => console.error('Error deleting volunteer:', error)
      });
    }
  }

  onToggleStatus(volunteer: any) {
    volunteer.isActive = !volunteer.isActive;
    this.adminService.updateVolunteer(volunteer).subscribe({
      next: () => console.log('Status updated successfully'),
      error: (error) => {
        console.error('Error updating status:', error);
        volunteer.isActive = !volunteer.isActive;
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
        const params = {
          image: this.uploadedImage
        };
        this.adminService.uploadImage(params).subscribe({
          next: (response: any) => {
            this.currentVolunteer.image = response.data; // Assuming the backend returns the image URL in this format
          },
          error: (error) => {
            console.error('Error uploading image:', error);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }
}