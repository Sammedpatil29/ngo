import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValunteersComponent } from './valunteers.component';

describe('ValunteersComponent', () => {
  let component: ValunteersComponent;
  let fixture: ComponentFixture<ValunteersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValunteersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValunteersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
