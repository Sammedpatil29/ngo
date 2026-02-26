import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MediaService } from '../../services/media.service';
import { AdminServiceService } from '../../services/admin-service.service';

interface Image {
  id: number;
  place: string;
  url: string;
  isActive: boolean;
}

interface Category {
  id: number;
  name: string;
  url: string;
  images: Image[];
}

@Component({
  selector: 'app-admin-images',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-images.component.html',
  styleUrls: ['./admin-images.component.css']
})
export class AdminImagesComponent implements OnInit {
  private mediaService = inject(MediaService);
  private adminService = inject(AdminServiceService);
  categories: Category[] = [];

  selectedCategory: Category | null = null;
  
  showModal = false;
  modalType: 'category' | 'image' = 'image';
  isEditing = false;

  currentCategory: any = {};
  currentImage: any = {};



  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.mediaService.getMedia().subscribe({
      next: (data) => {
        this.categories = data;
        if (this.categories.length > 0) {
          if (this.selectedCategory) {
            this.selectedCategory = this.categories.find(c => c.id === this.selectedCategory?.id) || this.categories[0];
          } else {
            this.selectedCategory = this.categories[0];
          }
        } else {
          this.selectedCategory = null;
        }
      },
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
  }

  onAddCategory() {
    this.modalType = 'category';
    this.isEditing = false;
    this.currentCategory = { name: '', url: '' };
    this.showModal = true;
  }

  onEditCategory(cat: Category) {
    this.modalType = 'category';
    this.isEditing = true;
    this.currentCategory = { ...cat };
    this.showModal = true;
  }

  onAddImage() {
    if (!this.selectedCategory) return;
    this.modalType = 'image';
    this.isEditing = false;
    this.currentImage = { place: '', url: '', isActive: true };
    this.showModal = true;
  }

  onEditImage(img: Image) {
    this.modalType = 'image';
    this.isEditing = true;
    this.currentImage = { ...img };
    this.showModal = true;
  }

  onDeleteCategory(cat: Category) {
    if (confirm(`Delete category ${cat.name}?`)) {
      this.mediaService.deleteCategory(cat.id).subscribe({
        next: () => {
          this.fetchCategories();
        },
        error: (err) => console.error('Error deleting category', err)
      });
    }
  }

  onDeleteImage(img: Image) {
    if (this.selectedCategory && confirm(`Delete image ${img.place}?`)) {
      this.mediaService.deleteImage(img.id).subscribe({
        next: () => this.fetchCategories(),
        error: (err) => console.error('Error deleting image', err)
      });
    }
  }

  onToggleImageStatus(img: Image) {
    const payload = { ...img, isActive: !img.isActive };
    this.mediaService.updateImage(payload).subscribe({
      next: () => img.isActive = !img.isActive,
      error: (err) => console.error('Error updating image status', err)
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
            this.currentCategory.url = response.data;
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

  closeModal() {
    this.showModal = false;
  }

  onSave() {
    if (this.modalType === 'category') {
      if (this.isEditing) {
        this.mediaService.updateCategory(this.currentCategory).subscribe({
          next: () => {
            this.fetchCategories();
            this.closeModal();
          },
          error: (err) => console.error('Error updating category', err)
        });
      } else {
        this.mediaService.addCategory(this.currentCategory).subscribe({
          next: () => {
            this.fetchCategories();
            this.closeModal();
          },
          error: (err) => console.error('Error creating category', err)
        });
      }
    } else {
      if (!this.selectedCategory) return;
      
      if (this.isEditing) {
        this.mediaService.updateImage(this.currentImage).subscribe({
          next: () => {
            this.fetchCategories();
            this.closeModal();
          },
          error: (err) => console.error('Error updating image', err)
        });
      } else {
        const payload = { ...this.currentImage, categoryId: this.selectedCategory.id };
        this.mediaService.addImage(payload).subscribe({
          next: () => {
            this.fetchCategories();
            this.closeModal();
          },
          error: (err) => console.error('Error creating image', err)
        });
      }
    }
  }
}
