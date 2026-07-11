import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { Router } from '@angular/router';
import { CommonServiceService } from '../../services/common-service.service';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FooterComponent, FormsModule, LoaderComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit, OnDestroy {
  // Navigation links using signals
  navItems = ['VOLUNTEERS', 'SERVICES', 'GALLERY', 'DONATION'];
  isLoading = false
  
  // Contact info
  contactPhone = signal('+91 82972 53484');
  contactEmail = signal('mayihelpyoufoundationjmd@gmail.com');

  // Carousel Data
  heroSlides: any[] = [
    // {
    //   image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
    //   title: 'Your Small Help Makes a',
    //   highlight: 'Difference'
    // },
    // {
    //   image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200',
    //   title: 'Empowering Communities for a',
    //   highlight: 'Better Tomorrow'
    // },
    // {
    //   image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200',
    //   title: 'Join Us in Spreading',
    //   highlight: 'Smiles'
    // }
  ];

  currentSlide = signal(0);
  private slideInterval: any;
  reviews: any[] = [];
  
  showFeedbackModal = false;
  isSubmitting = false;
  newReview = { name: '', ratings: 5, comment: '', date: '', isActive: false };

  constructor(
    private router: Router, 
    private commonService: CommonServiceService,
    private adminService: AdminServiceService
  ) {}

  ngOnInit() {
    this.getHomeData(true);
  }

  getHomeData(reload: boolean = false) {
    if(reload){
      this.isLoading = true;
    }
    this.commonService.getHomeData().subscribe({
      next: (response: any) => {
        this.heroSlides = response.banners;
        this.services = response.services;
        this.members = response.teamMembers;
        this.mediaAppearances = response.news;
        this.reviews = response.reviews;
        this.isLoading = false;
        this.startAutoSlide();
      },
      error: (error) => {
        console.error('Error fetching home data:', error);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide() {
    this.currentSlide.update(curr => (curr + 1) % this.heroSlides.length);
  }

  prevSlide() {
    this.currentSlide.update(curr => (curr - 1 + this.heroSlides.length) % this.heroSlides.length);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  // Services Data
  services:any[] = [
    // {
    //   title: 'Education Support',
    //   description: 'Providing books, uniforms, and tuition fees for underprivileged children to ensure they have access to quality education.',
    //   image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500'
    // },
    // {
    //   title: 'Medical Camps',
    //   description: 'Organizing free health check-up camps and distributing medicines in rural areas to improve community health.',
    //   image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500'
    // },
    // {
    //   title: 'Food Distribution',
    //   description: 'Regular food donation drives to feed the hungry and homeless, ensuring basic nutrition for all.',
    //   image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=500'
    // },
    // {
    //   title: 'Women Empowerment',
    //   description: 'Skill development workshops and vocational training to help women become financially independent.',
    //   image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500'
    // }
  ];

  // Members Data
  members: any[] = [
    // { name: 'John Doe', role: 'President', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
    // { name: 'Jane Smith', role: 'Secretary', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
    // { name: 'Robert Brown', role: 'Treasurer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' },
    // { name: 'Emily Davis', role: 'Coordinator', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' },
    // { name: 'Michael Wilson', role: 'Volunteer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    // { name: 'Sarah Johnson', role: 'Advisor', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400' },
  ];

  // Media Appearances Data
  mediaAppearances: any[] = [
    // { title: 'Feature in Local Daily', image: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500' },
    // { title: 'Community Award Ceremony', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500' },
    // { title: 'Charity Event Coverage', image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=500' }
  ];

  goto(item: string) {
    this.router.navigate([item.toLowerCase()]);
  }

  openWhatsApp() {
    window.open('https://wa.me/918297253484', '_blank');
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

  openInsta(){
    window.open('https://www.instagram.com/mayihelpyoufoundation?igsh=cjN4NWRreHFzazZz', '_blank');
  }

  openYoutube(){
    window.open('https://www.youtube.com/@Nannubhai-z3o', '_blank');
  }
}