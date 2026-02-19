import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-volunteers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-volunteers.component.html',
  styleUrl: './admin-volunteers.component.css'
})
export class AdminVolunteersComponent {
  volunteers = [
    { id: 1, name: 'Alice Green', role: 'Community Manager', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', isActive: true },
    { id: 2, name: 'David White', role: 'Field Coordinator', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', isActive: true },
    { id: 3, name: 'Emma Brown', role: 'Event Planner', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', isActive: true },
    { id: 4, name: 'James Black', role: 'Logistics', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400', isActive: true },
    { id: 5, name: 'Olivia Grey', role: 'Social Media', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', isActive: true },
    { id: 6, name: 'Michael Blue', role: 'Fundraiser', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', isActive: true },
    { id: 7, name: 'Sophia Red', role: 'Content Writer', image: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=400', isActive: true },
    { id: 8, name: 'Daniel Gold', role: 'Tech Support', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', isActive: true },
  ];

  showModal = false;
  isEditing = false;
  currentVolunteer: any = { id: 0, name: '', role: '', image: '', isActive: true };

  onAdd() {
    this.currentVolunteer = { id: 0, name: '', role: '', image: '', isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  onEdit(volunteer: any) {
    this.currentVolunteer = { ...volunteer };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSave() {
    if (this.isEditing) {
      const index = this.volunteers.findIndex(v => v.id === this.currentVolunteer.id);
      if (index !== -1) {
        this.volunteers[index] = this.currentVolunteer;
      }
    } else {
      this.currentVolunteer.id = this.volunteers.length > 0 ? Math.max(...this.volunteers.map(v => v.id)) + 1 : 1;
      this.volunteers.push(this.currentVolunteer);
    }
    this.closeModal();
  }

  onDelete(volunteer: any) {
    if(confirm(`Are you sure you want to delete ${volunteer.name}?`)) {
      this.volunteers = this.volunteers.filter(v => v.id !== volunteer.id);
    }
  }

  onToggleStatus(volunteer: any) {
    volunteer.isActive = !volunteer.isActive;
  }
}