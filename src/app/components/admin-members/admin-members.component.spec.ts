import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMembersComponent } from './admin-members.component';

describe('AdminMembersComponent', () => {
  let component: AdminMembersComponent;
  let fixture: ComponentFixture<AdminMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
