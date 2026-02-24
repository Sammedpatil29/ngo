import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-admin-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-members.component.html',
  styleUrl: './admin-members.component.css'
})
export class AdminMembersComponent implements OnInit {
  members: any[] = [];

  showModal = false;
  isEditing = false;
  currentMember: any = {   name: '', role: '', image: '', isActive: true };
  uploadedImage: any;

  constructor(private adminService: AdminServiceService) { }

  ngOnInit(): void {
    this.getMembers();
  }

  getMembers() {
    this.adminService.getMembers().subscribe({
      next: (response: any) => {
        this.members = response;
      },
      error: (error) => console.error('Error fetching members:', error)
    });
  }

  onAdd() {
    this.currentMember = {   name: '', role: '', image: '', isActive: true };
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
    this.getMembers();
  }

  onSave() {
    if (this.isEditing) {
      this.adminService.updateMembers(this.currentMember).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error updating member:', error)
      });
    } else {
      this.adminService.addMembers(this.currentMember).subscribe({
        next: (response: any) => {
          this.closeModal();
        },
        error: (error) => console.error('Error adding member:', error)
      });
    }
  }

  onDelete(member: any) {
    if(confirm(`Are you sure you want to delete ${member.name}?`)) {
      this.adminService.deleteMembers(member.id).subscribe({
        next: () => {
          this.members = this.members.filter(m => m.id !== member.id);
        },
        error: (error) => console.error('Error deleting member:', error)
      });
    }
  }

  onToggleStatus(member: any) {
    member.isActive = !member.isActive;
    this.adminService.updateMembers(member).subscribe({
      next: () => console.log('Status updated successfully'),
      error: (error) => {
        console.error('Error updating status:', error);
        member.isActive = !member.isActive;
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImage = e.target.result;
        const params = {
          image: this.uploadedImage
        };
        this.adminService.uploadImage(params).subscribe({
          next: (response: any) => {
            this.currentMember.image = response.data; // Assuming the backend returns the image URL in this format
          },
          error: (error) => {
            console.error('Error uploading image:', error);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }
}