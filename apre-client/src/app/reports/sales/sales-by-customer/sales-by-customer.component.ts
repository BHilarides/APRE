/**
 * Author: Ben Hilarides
 * Date: 24 January 2026
 * File: sales-by-customer.component.ts
 * Description: SalesByCustomerComponent definition
 */
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { Component } from '@angular/core';

import { environment } from '../../../../environments/environment';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-sales-by-customer',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent, CommonModule],
  template: `
    <h1>Sales by Customer</h1>
      <div class="customer-container">
        <form class="form" [formGroup]="customerForm" (ngSubmit)="onSubmit()">
          <div class="form__group">
            <label class="label" for="customer">Customer</label>
            <select class="select" formControlName="customer" name="customer">
              <option [ngValue]="null">Select a customer</option>
              @for (customer of customers; track customer.customerId) {
                <option [value]="customer.customerId">{{ customer.name }}</option>
              }
            </select>
          </div>
          <div class="form__actions"> 
            <button type="submit" class="button">Generate Report</button>
          </div>
        </form>

        @if (salesData.length) {
          <div class="card table-card">
            <app-table 
              [title]="'Sales by Customer'"
              [data]="salesData"
              [headers]="['Customer', 'Total Sales', 'Order Count']"
              [sortableColumns]="['Total Sales', 'Order Count']"
              [headerBackground]="'secondary'">
            </app-table>
          </div>
        }
      </div>
  `,
  styles: [`
    .customer-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .table-card {
      width: 50%;
      margin: 20px 0;
    }  
  `]
})
export class SalesByCustomerComponent {
  salesData: any[] = [];

  // Defined customer data, to be replaced with database customer data
  customers= [
    { customerId: 'Acme Corp', name: 'Acme Corp', totalSales: 15000, orderCount: 5 },
    { customerId: 'Beta LLC', name: 'Beta LLC', totalSales: 23000, orderCount: 8 },
    { customerId: 'Gamma LLC', name: 'Gamma LLC', totalSales: 12000, orderCount: 4 },
    { customerId: 'Lambda LLC', name: 'Lambda LLC', totalSales: 18000, orderCount: 6 },
    { customerId: 'Epsilon Ltd', name: 'Epsilon Ltd', totalSales: 25000, orderCount: 10 }
  ];

  customerForm = this.fb.group({
    customer: [null, Validators.compose([Validators.required])]
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  onSubmit() {
    // Additional troubleshooting required for generate report button
    console.log('Form submitted');
    console.log('Form valid?', this.customerForm.valid);
    console.log('Form value:', this.customerForm.value);

    if (!this.customerForm.valid) {
      console.log('Form is invalid - please select a customer');
      return; // Exit if form is invalid
    }

    const customer = this.customerForm.controls['customer'].value;
    console.log('Fetching data for customer:', customer);

    this.http.get(`${environment.apiBaseUrl}/reports/sales/customers/${customer}`).subscribe({
      next: (data: any) => {
        this.salesData = data;
        for (let item of this.salesData) {
          item['Customer'] = item['customerName'];
          item['Total Sales'] = item['totalSales'];
          item['Order Count'] = item['orderCount'];
        }

        console.log('salesData:', this.salesData);
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      }
    });
  }
}
