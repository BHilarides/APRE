/**
 * Author: Ben Hilarides
 * Date: 1 February 2026
 * File: resolution-time.component.ts
 * Description: ResolutionTimeComponent for displaying agent performance by resolution time
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';  


@Component({
  selector: 'app-resolution-time',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <div>
      <h1>Agent Performance By Resolution Time</h1>


      <div *ngIf="performanceData.length > 0" class="table-container">
        <div class="card table-card">
          <app-table
            [title]="'Agent Performance By Resolution Time'"
            [data]="performanceData"
            [headers]="['Agent', 'Avg Resolution Time (sec)', 'Call Count']"
            [sortableColumns]="['Agent', 'Avg Resolution Time (sec)', 'Call Count']">
          </app-table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-container {
      width: 70%;
      margin: 0 auto;
    }

    .table-card {
      width: 100%;
      margin: 20px 0;
    }
  `]
})
export class ResolutionTimeComponent {
  performanceData: any[] = [];

  constructor(private http: HttpClient) {
    this.fetchPerformanceData();
  }

  fetchPerformanceData() {
    console.log('Fetching performance data by resolution time...');

    this.http.get(`${environment.apiBaseUrl}/reports/agent-performance/call-by-resolution-time`).subscribe({
      next: (data: any) => {
        this.performanceData = data;

        // Transform data to match table headers
        for (let item of this.performanceData) {
          item['Agent'] = item['agent'];
          item['Avg Resolution Time (sec)'] = item['avgResolutionTime'];
          item['Call Count'] = item['callCount'];
        }

        console.log('Performance data:', this.performanceData);
      },
      error: (error: any) => {
        console.error('Error fetching resolution time data:', error);
      }
    });
  }
}