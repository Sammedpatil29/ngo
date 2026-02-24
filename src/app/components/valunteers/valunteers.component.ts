import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { CommonServiceService } from '../../services/common-service.service';

@Component({
  selector: 'app-valunteers',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './valunteers.component.html',
  styleUrl: './valunteers.component.css'
})
export class ValunteersComponent implements OnInit {
  volunteers: any[] = [];

  constructor(private commonService: CommonServiceService ) { }

  ngOnInit(): void {
      this.getVolunteers();
  }

  getVolunteers() {
    this.commonService.getVolunteers().subscribe({
      next: (response: any) => {
        this.volunteers = response;
        console.log(this.volunteers);
      },
      error: (error) => console.error('Error fetching volunteers:', error)
    });
  }
}