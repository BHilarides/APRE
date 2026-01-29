/**
 * Author: Professor Krasso edited by Ben Hilarides
 * Date: 24 January 2026
 * File: users.component.ts
 * Description: Adding display message after creating new user
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../user.interface';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from "../../../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [RouterLink, ConfirmDialogComponent],
  template: `
    <div>
      <h1>Users</h1>
      <a routerLink="/user-management/users/new" class="link button button--primary">Create User</a><br /><br />

      @if (creationMessage) {
        <div class="message message--success">{{ creationMessage }}</div>}
      @if (deletionMessage) {
        <div class="message message--success">{{ deletionMessage }}</div>
      }
      <table class="table">
        <thead>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Functions</th>
        </thead>
        <tbody>
          @for(user of users; track user) {
            <tr>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <a routerLink="/user-management/users/{{ user._id}}">
                  <i class="fas fa-edit"></i>
                </a> &nbsp;
                <a (click)="confirmDelete(user._id)">
                  <i class="fas fa-trash"></i>
                </a>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
    @if (showConfirmDialog) {
      <app-confirm-dialog [header]="dialogHeader" [message]="dialogMessage" (confirmed)="onConfirm($event)"></app-confirm-dialog>
    }
  `,
  styles: `
  `
})
export class UsersComponent implements OnInit {
  dialogHeader: string;
  dialogMessage: string;
  deletionMessage: string;
  users: Array<User>;
  showConfirmDialog: boolean = false;
  userIdToDelete: string | null = null;

  constructor(private http: HttpClient) {
    this.users = [];
    this.dialogHeader = '';
    this.dialogMessage = '';
    this.deletionMessage = '';
    this.creationMessage = '';
  }

  ngOnInit() {
    // Check for success message from user creation
    this.route.queryParams.subscribe(params => {
      if (params['created'] === 'true') {
        // Display creation success message
        this.creationMessage = 'User created successfully';
        // Clear the message after 2 seconds
        setTimeout(() => {
          this.creationMessage = '';
        }, 2000);
      }
    });
  
    this.http.get(`${environment.apiBaseUrl}/users`).subscribe({
      next: (users) => {
        this.users = users as Array<User>;
        console.log(users);
      }
    });
  }

  confirmDelete(userId: string) {
    this.dialogHeader = 'Confirm Deletion';
    this.dialogMessage = 'Are you sure you want to delete user: ' + userId + '?';
    this.userIdToDelete = userId;
    this.showConfirmDialog = true;
  }

  onConfirm(result: boolean) {
    if (result && this.userIdToDelete) {
      this.deleteUser(this.userIdToDelete);
    }
    this.showConfirmDialog = false;
    this.userIdToDelete = null;
  }

  deleteUser(userId: string) {
    this.http.delete(`${environment.apiBaseUrl}/users/${userId}`).subscribe({
      next: () => {
        this.users = this.users.filter((user) => user._id !== userId);
      },
      complete: () => {
        this.deletionMessage = 'User deleted successfully';

        setTimeout(() => {
          this.deletionMessage = '';
        }, 2000);
      }
    });
  }
}
