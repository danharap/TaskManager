import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TaskModel } from '../../models/task.model';
import { UpdateUsernameDialogComponent } from '../update-username-dialog/update-username-dialog.component';
import { UpdateRoleDialogComponent } from '../update-role-dialog/update-role-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  tasks: TaskModel[] = [];
  isTaskView: boolean = false; // Toggle between User Management and Task Management
  newRole: string = '';
  newUsername: string = '';
  userRole: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');

    // Listen for query parameter changes
    this.route.queryParams.subscribe((params) => {
      const view = params['view'];
      this.isTaskView = view === 'tasks'; // Toggle based on the query parameter
      if (this.isTaskView) {
        this.getAllTasks();
      } else {
        this.getAllUsers();
      }
    });
  }

    openUpdateUsernameDialog(user: User) {
    const dialogRef = this.dialog.open(UpdateUsernameDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers(); // Refresh the user list after updating
      }
    });
  }

  // Open Update Role Dialog
  openUpdateRoleDialog(user: User) {
    const dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers(); // Refresh the user list after updating
      }
    });
  }

  // Fetch all users
  getAllUsers() {
    this.http.get<User[]>('https://localhost:7119/api/auth/users').subscribe({
      next: (users) => (this.users = users),
      error: (err) => alert('Failed to fetch users')
    });
  }

  // Fetch all tasks
  getAllTasks() {
    this.http.get<TaskModel[]>('https://localhost:7119/api/tasks/all').subscribe({
      next: (tasks) => (this.tasks = tasks),
      error: (err) => alert('Failed to fetch tasks')
    });
  }

  // Update a user's username
  updateUsername(user: User) {
    if (!this.newUsername) {
      alert('New username cannot be empty.');
      return;
    }

    this.http.put(`https://localhost:7119/api/auth/users/${user.id}/username`, { newUsername: this.newUsername }).subscribe({
      next: () => {
        user.username = this.newUsername;
        this.newUsername = '';
        alert('Username updated successfully');
      },
      error: (err) => alert('Failed to update username')
    });
  }

  // Update a user's role
  setRole(user: User) {
    if (!this.newRole) return;

    this.http.put(`https://localhost:7119/api/auth/users/${user.id}/role`, { role: this.newRole }).subscribe({
      next: () => {
        user.role = this.newRole;
        this.newRole = '';
        alert('Role updated');
      },
      error: (err) => alert('Failed to update role')
    });
  }

  // Delete a user
  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user and all their tasks?')) {
      this.http.delete(`https://localhost:7119/api/auth/users/${id}`).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== id);
          alert('User deleted');
        },
        error: (err) => alert('Failed to delete user')
      });
    }
  }

  // Delete a task
  deleteTask(id: number) {
  if (confirm('Are you sure you want to delete this task?')) {
    const headers = { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` };

    this.http.delete(`https://localhost:7119/api/tasks/${id}`, { headers }).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== id);
        alert('Task deleted');
      },
      error: (err) => {
        alert(err.error?.Message || 'Failed to delete task');
      }
    });
  }
}
}