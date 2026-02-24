import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-banners.component.html',
  styleUrl: './admin-banners.component.css'
})
export class AdminBannersComponent implements OnInit {
  banners: any[] = [
    
  ];

  showModal = false;
  isEditing = false;
  currentBanner: any = {  title: '', highlight: '', image: '', isActive: true };
  uploadedImage: any;


  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getBanners();
  }

  getBanners() {
    this.adminService.getBanners().subscribe({
      next: (response: any) => {
        this.banners = response;
      },
      error: (error) => console.error('Error fetching banners:', error)
    });
  }

  onAdd() {
    this.currentBanner = {  title: '', highlight: '', image: '', isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  onEdit(banner: any) {
    this.currentBanner = { ...banner };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.getBanners();
  }

  onSave() {
    if (this.isEditing) {
      this.adminService.updateBanners(this.currentBanner).subscribe({
        next: (response: any) => {
          this.getBanners();
          this.closeModal();
        },
        error: (error) => console.error('Error updating banner:', error)
      });
    } else {
      this.adminService.addBanners(this.currentBanner).subscribe({
        next: (response: any) => {
          this.getBanners();
          this.closeModal();
        },
        error: (error) => console.error('Error adding banner:', error)
      });
    }
  }

  onDelete(banner: any) {
    if(confirm(`Are you sure you want to delete this banner?`)) {
      this.adminService.deleteBanners(banner.id).subscribe({
        next: () => {
          this.banners = this.banners.filter((b:any) => b.id !== banner.id);
        },
        error: (error) => console.error('Error deleting banner:', error)
      });
    }
  }

  onToggleStatus(banner: any) {
    banner.isActive = !banner.isActive;
    this.adminService.updateBanners(banner).subscribe({
      next: () => console.log('Status updated successfully'),
      error: (error) => {
        console.error('Error updating status:', error);
        banner.isActive = !banner.isActive;
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
            this.currentBanner.image = response.data; // Assuming the backend returns the image URL in this format
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