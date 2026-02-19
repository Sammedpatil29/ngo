import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-members.component.html',
  styleUrl: './admin-members.component.css'
})
export class AdminMembersComponent {
  members = [
    { id: 1, name: 'John Doe', role: 'President', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400', isActive: true },
    { id: 2, name: 'Jane Smith', role: 'Secretary', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400', isActive: true },
    { id: 3, name: 'Robert Brown', role: 'Treasurer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400', isActive: true },
    { id: 4, name: 'Emily Davis', role: 'Coordinator', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400', isActive: false },
    { id: 5, name: 'Michael Wilson', role: 'Volunteer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', isActive: true },
    { id: 6, name: 'Sarah Johnson', role: 'Advisor', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400', isActive: true },
  ];

  showModal = false;
  isEditing = false;
  currentMember: any = { id: 0, name: '', role: '', image: '', isActive: true };

  onAdd() {
    this.currentMember = { id: 0, name: '', role: '', image: '', isActive: true };
    this.isEditing = false;
    this.showModal = true;
  }

  onEdit(member: any) {
    this.currentMember = { ...member };
    this.isEditing = true;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSave() {
    if (this.isEditing) {
      const index = this.members.findIndex(m => m.id === this.currentMember.id);
      if (index !== -1) {
        this.members[index] = this.currentMember;
      }
    } else {
      this.currentMember.id = this.members.length > 0 ? Math.max(...this.members.map(m => m.id)) + 1 : 1;
      this.members.push(this.currentMember);
    }
    this.closeModal();
  }

  onDelete(member: any) {
    if(confirm(`Are you sure you want to delete ${member.name}?`)) {
      this.members = this.members.filter(m => m.id !== member.id);
    }
  }

  onToggleStatus(member: any) {
    member.isActive = !member.isActive;
  }
}