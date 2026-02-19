import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-services.component.html',
  styleUrl: './admin-services.component.css'
})
export class AdminServicesComponent {
  services = [
    {
      id: 1,
      title: 'Education Support',
      description: 'Providing books, uniforms, and tuition fees for underprivileged children to ensure they have access to quality education.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500',
      isActive: true
    },
    {
      id: 2,
      title: 'Medical Camps',
      description: 'Organizing free health check-up camps and distributing medicines in rural areas to improve community health.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500',
      isActive: true
    },
    {
      id: 3,
      title: 'Food Distribution',
      description: 'Regular food donation drives to feed the hungry and homeless, ensuring basic nutrition for all.',
      image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=500',
      isActive: true
    },
    {
      id: 4,
      title: 'Women Empowerment',
      description: 'Skill development workshops and vocational training to help women become financially independent.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500',
      isActive: true
    }
  ];

  showModal = false;
  isEditing = false;
  currentService: any = { id: 0, title: '', description: '', image: '', isActive: true };

  onAdd() {
    this.currentService = { id: 0, title: '', description: '', image: '', isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  onEdit(service: any) {
    this.currentService = { ...service };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSave() {
    if (this.isEditing) {
      const index = this.services.findIndex(s => s.id === this.currentService.id);
      if (index !== -1) {
        this.services[index] = this.currentService;
      }
    } else {
      this.currentService.id = this.services.length > 0 ? Math.max(...this.services.map(s => s.id)) + 1 : 1;
      this.services.push(this.currentService);
    }
    this.closeModal();
  }

  onDelete(service: any) {
    if(confirm(`Are you sure you want to delete ${service.title}?`)) {
      this.services = this.services.filter(s => s.id !== service.id);
    }
  }

  onToggleStatus(service: any) {
    service.isActive = !service.isActive;
  }
}