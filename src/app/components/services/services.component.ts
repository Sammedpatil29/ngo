import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { CommonServiceService } from '../../services/common-service.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  services: any[] = [];

  constructor(private commonService: CommonServiceService) { }

  ngOnInit(): void {
    this.getServices();
  }

  getServices() {
    this.commonService.getServices().subscribe({
      next: (response: any) => {
        this.services = response;
        console.log(this.services);
      },
      error: (error) => console.error('Error fetching services:', error)
    });
  }

}