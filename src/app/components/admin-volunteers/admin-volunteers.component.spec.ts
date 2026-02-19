import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVolunteersComponent } from './admin-volunteers.component';

describe('AdminVolunteersComponent', () => {
  let component: AdminVolunteersComponent;
  let fixture: ComponentFixture<AdminVolunteersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVolunteersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVolunteersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
