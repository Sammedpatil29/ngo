import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MediaService } from '../../services/media.service';
import { FooterComponent } from '../footer/footer.component';

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
  imports: [CommonModule, FooterComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  private mediaService = inject(MediaService);
  categories: Category[] = [];

  selectedCategory: Category | null = null;

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.mediaService.getMedia().subscribe({
      next: (data) => {
        this.categories = data;
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0];
        }
      },
      error: (err) => console.error('Error fetching gallery data', err)
    });
  }

  selectCategory(cat: Category) {
    this.selectedCategory = cat;
  }
}
