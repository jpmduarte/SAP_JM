import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtenteDashboardComponent } from './utente-dashboard.component';

describe('UtenteDashboardComponent', () => {
  let component: UtenteDashboardComponent;
  let fixture: ComponentFixture<UtenteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtenteDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UtenteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
