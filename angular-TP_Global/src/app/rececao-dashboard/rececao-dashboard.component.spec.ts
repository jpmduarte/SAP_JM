import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RececaoDashboardComponent } from './rececao-dashboard.component';

describe('RececaoDashboardComponent', () => {
  let component: RececaoDashboardComponent;
  let fixture: ComponentFixture<RececaoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RececaoDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RececaoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
