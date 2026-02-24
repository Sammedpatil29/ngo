import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-images',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-images.component.html',
  styleUrl: './admin-images.component.css'
})
export class AdminImagesComponent implements OnInit {
  images:any[] = [
  ];

  showModal = false;
  isEditing = false;
  currentImage: any = {  place: '', url: '', isActive: true };

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getImages();
  }

getImages() {
    this.adminService.getImages().subscribe({
      next: (response: any) => {
        this.images = response;
      },
      error: (error) => console.error('Error fetching images:', error)
    });
  }


  onAdd() {
    this.currentImage = { place: '', url: '', isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  onEdit(img: any) {
    this.currentImage = { ...img };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.getImages();
  }

  onSave() {
    if (this.isEditing) {
      this.adminService.updateMedia(this.currentImage).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error updating image:', error)
      });
    } else {
      this.adminService.addmedia(this.currentImage).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error adding image:', error)
      });
    }
  }

  onDelete(img: any) {
    if(confirm(`Are you sure you want to delete image for ${img.place}?`)) {
      this.adminService.deleteMedia(img.id).subscribe({
        next: () => {
          this.images = this.images.filter(i => i.id !== img.id);
        },
        error: (error) => console.error('Error deleting image:', error)
      });
    }
  }

  onToggleStatus(img: any) {
    img.isActive = !img.isActive;
    this.adminService.updateMedia(img).subscribe({
      next: () => console.log('Status updated successfully'),
      error: (error) => {
        console.error('Error updating status:', error);
        img.isActive = !img.isActive;
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const params = {
          image: e.target.result
        };
        this.adminService.uploadImage(params).subscribe({
          next: (response: any) => {
            this.currentImage.url = response.data;
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