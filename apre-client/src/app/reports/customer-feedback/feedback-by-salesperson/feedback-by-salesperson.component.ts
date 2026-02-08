/**
 * Author: Ben Hilarides
 * Date: February, 7, 2026
 * File: feedback-by-salesperson.component.ts
 * Description: Component to display customer feedback data by salesperson.
 * Automatically loads all salespeople sorted by average rating on initialization
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-feedback-by-salesperson',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div>
      <h1>Customer Feedback By Salesperson</h1>

      <div *ngIf="feedbackData.length > 0" class="table-container">
        <div class="card table-card">
          <app-table
            [title]="'Customer Feedback by Salesperson'"
            [data]="feedbackData"
            [headers]="['Salesperson', 'Avg Rating', 'Feedback Count']"
            [sortableColumns]="['Average Rating', 'Feedback Count']"
            [headerBackground]="'secondary'">
          </app-table>
        </div>
      </div>
    </div>
  `,
  styles: `
    .table-container {
      width: 70%;
      margin: 0 auto;
    }

    .table-card {
      width: 100%;
      margin: 20px 0;
    }
  `
})
export class FeedbackBySalespersonComponent {
  feedbackData: any[] = [];

  constructor(private http: HttpClient) {
    this.fetchFeedbackData();
  }

  fetchFeedbackData() {
    console.log('Fetching customer feedback data by salesperson');

    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-salesperson`).subscribe({
      next: (data: any) => {
        this.feedbackData = data;

        // Transform data to match table headers
        for (let item of this.feedbackData) {
          item['Salesperson'] = item['salesperson'];
          item['Avg Rating'] = item['avgRating'];
          item['Feedback Count'] = item['feedbackCount'];
        }

        console.log('Feedback data:', this.feedbackData);
      },

      error: (error: any) => {
        console.error('Error fetching feedback data:', error);
      }
    });
  }
}
