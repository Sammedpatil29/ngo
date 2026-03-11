import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { CommonServiceService } from '../../services/common-service.service';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-valunteers',
  standalone: true,
  imports: [CommonModule, FooterComponent, LoaderComponent],
  templateUrl: './valunteers.component.html',
  styleUrl: './valunteers.component.css'
})
export class ValunteersComponent implements OnInit {
  volunteers: any[] = [];
  isLoading = false;

  constructor(private commonService: CommonServiceService ) { }

  ngOnInit(): void {
      this.getVolunteers();
  }

  getVolunteers() {
    this.isLoading = true;
    this.commonService.getVolunteers().subscribe({
      next: (response: any) => {
        this.volunteers = response;
        this.isLoading = false;
        console.log(this.volunteers);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching volunteers:', error);
      }
    });
  }
}