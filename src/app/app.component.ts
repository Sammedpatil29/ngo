import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminServiceService } from './services/admin-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ngo';
  showFeedbackModal = false;
  isSubmitting = false;
  newReview = { name: '', ratings: 5, comment: '', date: '', isActive: false };

  constructor(private adminService: AdminServiceService, private router: Router){}

  ngOnInit() {
    setTimeout(() => {
      if(this.router.url === '/home' || this.router.url === '/') {
        this.openFeedbackModal();
      }
    }, 10000)
  }

  openFeedbackModal() {
    this.newReview = { name: '', ratings: 5, comment: '', date: new Date().toISOString().split('T')[0], isActive: false };
    this.showFeedbackModal = true;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
  }

  submitFeedback() {
    this.isSubmitting = true;
    this.adminService.aaddReview(this.newReview).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert('Thank you for your feedback!');
        this.closeFeedbackModal();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting feedback:', err);
        alert('Failed to submit feedback. Please try again later.');
      }
    });
  }
}
