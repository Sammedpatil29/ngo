import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-news.component.html',
  styleUrl: './admin-news.component.css'
})
export class AdminNewsComponent {
  mediaItems = [
    { id: 1, title: 'Feature in Local Daily', image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500', isActive: true },
    { id: 2, title: 'Community Award Ceremony', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500', isActive: true },
    { id: 3, title: 'Charity Event Coverage', image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=500', isActive: true }
  ];

  showModal = false;
  isEditing = false;
  currentMedia: any = { id: 0, title: '', image: '', isActive: true };

  onAdd() {
    this.currentMedia = { id: 0, title: '', image: '', isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  onEdit(item: any) {
    this.currentMedia = { ...item };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSave() {
    if (this.isEditing) {
      const index = this.mediaItems.findIndex(m => m.id === this.currentMedia.id);
      if (index !== -1) {
        this.mediaItems[index] = this.currentMedia;
      }
    } else {
      this.currentMedia.id = this.mediaItems.length > 0 ? Math.max(...this.mediaItems.map(m => m.id)) + 1 : 1;
      this.mediaItems.push(this.currentMedia);
    }
    this.closeModal();
  }

  onDelete(item: any) {
    if(confirm(`Are you sure you want to delete "${item.title}"?`)) {
      this.mediaItems = this.mediaItems.filter(m => m.id !== item.id);
    }
  }

  onToggleStatus(item: any) {
    item.isActive = !item.isActive;
  }
}