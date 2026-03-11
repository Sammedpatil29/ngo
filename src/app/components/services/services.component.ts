import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { CommonServiceService } from '../../services/common-service.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FooterComponent, LoaderComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  isLoading = false;


  constructor(private commonService: CommonServiceService) { }

  ngOnInit(): void {
    this.getServices();
  }

  getServices() {
    this.isLoading = true;
    this.commonService.getServices().subscribe({
      next: (response: any) => {
        this.services = response;
        this.isLoading = false;
        console.log(this.services);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching services:', error)
      }
    });
  }

}