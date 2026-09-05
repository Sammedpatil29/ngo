import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  // Selected category for the popup album view
  activeCategoryModal: Category | null = null;
  activeImages: Image[] = [];

  // Lightbox full-screen view
  viewingImage: Image | null = null;
  currentImageIndex: number = 0;

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.isLoading = true;
    this.mediaService.getMedia().subscribe({
      next: (data) => {
        this.categories = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching gallery data', err);
      }
    });
  }

  getActiveImagesCount(cat: Category): number {
    if (!cat || !cat.images) return 0;
    return cat.images.filter(img => img.isActive !== false).length;
  }

  openCategory(cat: Category) {
    this.activeCategoryModal = cat;
    this.activeImages = (cat.images || []).filter(img => img.isActive !== false);
    document.body.style.overflow = 'hidden';
  }

  closeCategoryModal() {
    this.activeCategoryModal = null;
    this.viewingImage = null;
    document.body.style.overflow = '';
  }

  openLightbox(img: Image) {
    if (this.activeImages.length > 0) {
      this.currentImageIndex = this.activeImages.findIndex(i => i.id === img.id);
      if (this.currentImageIndex === -1) {
        this.currentImageIndex = 0;
      }
      this.viewingImage = this.activeImages[this.currentImageIndex];
    }
  }

  closeLightbox() {
    this.viewingImage = null;
  }

  prevImage() {
    if (this.activeImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.activeImages.length) % this.activeImages.length;
      this.viewingImage = this.activeImages[this.currentImageIndex];
    }
  }

  nextImage() {
    if (this.activeImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.activeImages.length;
      this.viewingImage = this.activeImages[this.currentImageIndex];
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.viewingImage) {
      if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'Escape') {
        this.closeLightbox();
      }
    } else if (this.activeCategoryModal && event.key === 'Escape') {
      this.closeCategoryModal();
    }
  }
}
