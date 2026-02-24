import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-news',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-news.component.html',
  styleUrl: './admin-news.component.css'
})
export class AdminNewsComponent implements OnInit {
  mediaItems:any[] = [
  ];

  showModal = false;
  isEditing = false;
  currentMedia: any = {  title: '', image: '', isActive: true };
  uploadedImage: any;

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getNews();
  }

  getNews() {
    this.adminService.getNews().subscribe({
      next: (response: any) => {
        this.mediaItems = response;
      },
      error: (error) => console.error('Error fetching news:', error)
    });
  }


  onAdd() {
    this.currentMedia = {  title: '', image: '', isActive: true };
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
    this.getNews();
  }

  onSave() {
    if (this.isEditing) {
      this.adminService.updateNews(this.currentMedia).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error updating news:', error)
      });
    } else {
      this.adminService.addNews(this.currentMedia).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error adding news:', error)
      });
    }
  }

  onDelete(item: any) {
    if (confirm(`Are you sure you want to delete "${item.title}"?`)) {
      this.adminService.deleteNews(item.id).subscribe({
        next: () => {
          this.mediaItems = this.mediaItems.filter(m => m.id !== item.id);
        },
        error: (error) => console.error('Error deleting news:', error)
      });
    }
  }

  onToggleStatus(item: any) {
    item.isActive = !item.isActive;
    this.adminService.updateNews(item).subscribe({
      next: () => console.log('Status updated successfully'),
      error: (error) => {
        console.error('Error updating status:', error);
        item.isActive = !item.isActive;
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
            this.currentMedia.image = response.data;
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