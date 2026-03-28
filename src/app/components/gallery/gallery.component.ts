import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MediaService } from '../../services/media.service';
import { FooterComponent } from '../footer/footer.component';
import { LoaderComponent } from "../loader/loader.component";

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
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, FooterComponent, LoaderComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  private mediaService = inject(MediaService);
  categories: Category[] = [];
  isLoading = false;

  selectedCategory: Category | null = null;
  
  viewingImage: Image | null = null;
  activeImages: Image[] = [];
  currentImageIndex: number = 0;

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.isLoading = true;
    this.mediaService.getMedia().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching gallery data', err);
      }
    });
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
  }

  openLightbox(img: Image) {
    if (this.selectedCategory && this.selectedCategory.images) {
      // Filter so the next/prev buttons only cycle through active images
      this.activeImages = this.selectedCategory.images.filter(i => i.isActive);
      this.currentImageIndex = this.activeImages.findIndex(i => i.id === img.id);
      this.viewingImage = this.activeImages[this.currentImageIndex];
    }
  }

  closeLightbox() {
    this.viewingImage = null;
  }

  prevImage() {
    if (this.activeImages.length > 0) {
      // Navigate to previous, loop around to end if at the start
      this.currentImageIndex = (this.currentImageIndex - 1 + this.activeImages.length) % this.activeImages.length;
      this.viewingImage = this.activeImages[this.currentImageIndex];
    }
  }

  nextImage() {
    if (this.activeImages.length > 0) {
      // Navigate to next, loop around to start if at the end
      this.currentImageIndex = (this.currentImageIndex + 1) % this.activeImages.length;
      this.viewingImage = this.activeImages[this.currentImageIndex];
    }
  }
}
