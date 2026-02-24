import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent implements OnInit {
  services:any[] = [];

  showModal = false;
  isEditing = false;
  currentService: any = {  title: '', description: '', image: '', isActive: true };
  uploadedImage: any;



  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getServices();
  }


  getServices() {
    this.adminService.getServices().subscribe({
      next: (response: any) => {
        this.services = response;
      },
      error: (error) => console.error('Error fetching services:', error)
    });
  }


  onAdd() {
    this.currentService = {  title: '', description: '', image: '', isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  onEdit(service: any) {
    this.currentService = { ...service };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.getServices();
  }

  onSave() {
    if (this.isEditing) {
      this.adminService.updateServices(this.currentService).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error updating service:', error)
      });
    } else {
      this.adminService.addServices(this.currentService).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error adding service:', error)
      });
    }
  }

  onDelete(service: any) {
    if(confirm(`Are you sure you want to delete ${service.title}?`)) {
      this.adminService.deleteServices(service.id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s.id !== service.id);
        },
        error: (error) => console.error('Error deleting service:', error)
      });
    }
  }

  onToggleStatus(service: any) {
    service.isActive = !service.isActive;
    this.adminService.updateServices(service).subscribe({
      next: () => console.log('Status updated successfully'),
      error: (error) => {
        console.error('Error updating status:', error);
        service.isActive = !service.isActive;
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
            this.currentService.image = response.data; // Assuming the backend returns the image URL in this format
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