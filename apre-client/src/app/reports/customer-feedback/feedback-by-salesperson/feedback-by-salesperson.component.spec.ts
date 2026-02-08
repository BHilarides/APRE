import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackBySalespersonComponent } from './feedback-by-salesperson.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FeedbackBySalespersonComponent', () => {
  let component: FeedbackBySalespersonComponent;
  let fixture: ComponentFixture<FeedbackBySalespersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FeedbackBySalespersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackBySalespersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Customer Feedback By Salesperson"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Customer Feedback By Salesperson');
  });

  it('should fetch and display data on initialization', () => {
    expect(component.feedbackData).toBeDefined();
    expect(Array.isArray(component.feedbackData)).toBeTrue();
  });

  it('should handle empty data gracefully when no feedback data is returned', () => {
    component.feedbackData = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tableElement = compiled.querySelector('app-table');

    // Table should not render with no data
    expect(tableElement).toBeFalsy();
  });
});
