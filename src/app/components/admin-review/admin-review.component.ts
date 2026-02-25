import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-review.component.html',
  styleUrl: './admin-review.component.css'
})
export class AdminReviewComponent implements OnInit {
  reviews: any[] = [
  ];
  showModal = false;
  isEditing = false;
  currentReview: any = { name: '', ratings: 5, comment: '', date: '', isActive: true };

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getReviews();
  }

  getReviews() {
    this.adminService.getReviews().subscribe({
      next: (response: any) => {
        this.reviews = response;
      },
      error: (error) => console.error('Error fetching reviews:', error)
    });
  }

  onAdd() {
    this.currentReview = { name: '', ratings: 5, comment: '', date: new Date().toISOString().split('T')[0], isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  onEdit(review: any) {
    this.currentReview = { ...review };
    // Format date for input if necessary
    if(this.currentReview.date) {
        this.currentReview.date = new Date(this.currentReview.date).toISOString().split('T')[0];
    }
    this.isEditing = true;
    this.showModal = true;
  }

  onDelete(review: any) {
    if(confirm('Are you sure you want to delete this review?')) {
      this.adminService.deleteReview(review.id).subscribe({
        next: () => {
          this.reviews = this.reviews.filter(r => r.id !== review.id);
        },
        error: (error) => console.error('Error deleting review:', error)
      });
    }
  }

  onSave() {
    if (this.isEditing) {
      this.adminService.updateReview(this.currentReview).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (error) => console.error('Error updating review:', error)
      });
    } else {
      this.adminService.addReview(this.currentReview).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (error) => console.error('Error adding review:', error)
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.getReviews();
  }
  
  onToggleStatus(review: any) {
    review.isActive = !review.isActive;
    this.adminService.updateReview(review).subscribe({
      next: () => console.log('Status updated'),
      error: (err) => {
        console.error(err);
        review.isActive = !review.isActive;
      }
    });
  }
}