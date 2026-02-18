import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent {
  services = [
    {
      title: 'Education Support',
      description: 'Providing books, uniforms, and tuition fees for underprivileged children to ensure they have access to quality education.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500'
    },
    {
      title: 'Medical Camps',
      description: 'Organizing free health check-up camps and distributing medicines in rural areas to improve community health.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500'
    },
    {
      title: 'Food Distribution',
      description: 'Regular food donation drives to feed the hungry and homeless, ensuring basic nutrition for all.',
      image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=500'
    },
    {
      title: 'Women Empowerment',
      description: 'Skill development workshops and vocational training to help women become financially independent.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500'
    }
  ];
}