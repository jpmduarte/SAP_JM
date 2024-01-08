import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoDashboardComponent } from './medico-dashboard.component';

describe('MedicoDashboardComponent', () => {
  let component: MedicoDashboardComponent;
  let fixture: ComponentFixture<MedicoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicoDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
