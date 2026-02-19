import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-banners',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-banners.component.html',
  styleUrl: './admin-banners.component.css'
})
export class AdminBannersComponent {
  banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
      title: 'Your Small Help Makes a',
      highlight: 'Difference',
      isActive: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200',
      title: 'Empowering Communities for a',
      highlight: 'Better Tomorrow',
      isActive: true
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200',
      title: 'Join Us in Spreading',
      highlight: 'Smiles',
      isActive: true
    }
  ];

  showModal = false;
  isEditing = false;
  currentBanner: any = { id: 0, title: '', highlight: '', image: '', isActive: true };

  onAdd() {
    this.currentBanner = { id: 0, title: '', highlight: '', image: '', isActive: true };
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
  }

  onSave() {
    if (this.isEditing) {
      const index = this.banners.findIndex(b => b.id === this.currentBanner.id);
      if (index !== -1) {
        this.banners[index] = this.currentBanner;
      }
    } else {
      this.currentBanner.id = this.banners.length > 0 ? Math.max(...this.banners.map(b => b.id)) + 1 : 1;
      this.banners.push(this.currentBanner);
    }
    this.closeModal();
  }

  onDelete(banner: any) {
    if(confirm(`Are you sure you want to delete this banner?`)) {
      this.banners = this.banners.filter(b => b.id !== banner.id);
    }
  }

  onToggleStatus(banner: any) {
    banner.isActive = !banner.isActive;
  }
}