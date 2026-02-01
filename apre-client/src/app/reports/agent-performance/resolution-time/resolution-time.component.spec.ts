/**
 * Author: Ben Hilarides
 * Date: 1 February 2026
 * File: resolution-time.component.spec.ts
 * Description: Unit tests for the ResolutionTimeComponent
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResolutionTimeComponent } from './resolution-time.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ResolutionTimeComponent', () => {
  let component: ResolutionTimeComponent;
  let fixture: ComponentFixture<ResolutionTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ResolutionTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolutionTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Agent Performance By Resolution Time"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Agent Performance By Resolution Time');
  });

  it('should fetch and display data on initialization', () => {
    expect(component.performanceData).toBeDefined();
    expect(Array.isArray(component.performanceData)).toBeTrue();
  });

  it('should handle empty data gracefully when no performance data is returned', () => {
    component.performanceData = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const tableElement = compiled.querySelector('app-table');

    // Table should not be rendered when there is no data
    expect(tableElement).toBeFalsy();
  });
});
