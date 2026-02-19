import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-images',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-images.component.html',
  styleUrl: './admin-images.component.css'
})
export class AdminImagesComponent {
  images = [
    { id: 1, place: 'Community Center', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500', isActive: true },
    { id: 2, place: 'School Visit', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500', isActive: true },
    { id: 3, place: 'Medical Camp', url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500', isActive: true },
    { id: 4, place: 'Food Drive', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500', isActive: true }
  ];

  showModal = false;
  isEditing = false;
  currentImage: any = { id: 0, place: '', url: '', isActive: true };

  onAdd() {
    this.currentImage = { id: 0, place: '', url: '', isActive: true };
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
  }

  onSave() {
    if (this.isEditing) {
      const index = this.images.findIndex(i => i.id === this.currentImage.id);
      if (index !== -1) {
        this.images[index] = this.currentImage;
      }
    } else {
      this.currentImage.id = this.images.length > 0 ? Math.max(...this.images.map(i => i.id)) + 1 : 1;
      this.images.push(this.currentImage);
    }
    this.closeModal();
  }

  onDelete(img: any) {
    if(confirm(`Are you sure you want to delete image for ${img.place}?`)) {
      this.images = this.images.filter(i => i.id !== img.id);
    }
  }

  onToggleStatus(img: any) {
    img.isActive = !img.isActive;
  }
}