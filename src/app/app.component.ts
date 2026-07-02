import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  newReview = { name: '', ratings: 5, comment: '', date: '', isActive: false };

  constructor(private adminService: AdminServiceService){}

  ngOnInit() {
    setTimeout(() => {
      this.openFeedbackModal();
    }, 5000)
  }

  openFeedbackModal() {
    this.newReview = { name: '', ratings: 5, comment: '', date: new Date().toISOString().split('T')[0], isActive: false };
    this.showFeedbackModal = true;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
  }

  submitFeedback() {
    this.adminService.aaddReview(this.newReview).subscribe({
      next: () => {
        alert('Thank you for your feedback!');
        this.closeFeedbackModal();
      },
      error: (err) => console.error('Error submitting feedback:', err)
    });
  }
}
