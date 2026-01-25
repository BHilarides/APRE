/**
 * Author: Ben Hilarides
 * Date: 24 January 2026
 * File: sales-by-customer.component.spec.ts
 * Description: Unit tests for SalesByCustomerComponent
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesByCustomerComponent } from './sales-by-customer.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SalesByCustomerComponent', () => {
  let component: SalesByCustomerComponent;
  let fixture: ComponentFixture<SalesByCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,SalesByCustomerComponent] // Import SalesByCustomerComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Sales by Customer"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Customer');
  });

  it('should not submit the form if no customer is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.customerForm.valid).toBeFalse();
  });

  it('should initialize the customerForm with a null value', () => {
    const customerControl = component.customerForm.controls['customer'];
    expect(customerControl.value).toBeNull();
    expect(customerControl.valid).toBeFalse();
  });
});
