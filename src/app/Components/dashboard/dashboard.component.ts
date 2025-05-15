import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskModel } from '../../models/task.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskComponent } from '../../update-task/update-task.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  showCreateTask = false;
  searchQuery: string = '';
  tasks: TaskModel[] = [];
  filteredTasks: TaskModel[] = [];
  sortOrder: 'newest' | 'oldest' | 'plannedCompletion' = 'newest'; // Add 'plannedCompletion'
  priorityFilter: 'All' | 'Low' | 'Medium' | 'High' = 'All';
  userRole: string | null = null;
  name: string | null = null;
  allTasks: TaskModel[] = [];

  constructor(private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    this.name = localStorage.getItem('userName');
    this.getTasks();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onViewSubTasks(task: TaskModel) {
  this.router.navigate(['/tasks', task.id, 'subtasks']);
}

  getTasks() {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        this.filterTasks(); // Apply the filter after fetching tasks
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.filterTasks(); // Filter tasks whenever the search query changes
  }

  onTaskCreated(task: TaskModel) {
    this.taskService.addTask(task).subscribe({ 
      next: () => {
        this.getTasks();
        this.showCreateTask = false;
      }
    });
  }

    openCreateTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '60px',
      panelClass: 'custom-dialog-container' // Custom class for styling
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onTaskCreated(result); // Handle the created task
      }
    });
  }

  onEditTask(task: TaskModel) {
    const dialogRef = this.dialog.open(UpdateTaskComponent, {
      width: '60px',
      panelClass: 'custom-dialog-container', // Optional: Add custom styling
      data: { task } // Pass the selected task to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getTasks(); // Refresh the task list after updating
      }
    });
  }

  onDeleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.getTasks(); // Refresh the list after deletion
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  filterTasks() {
    let filtered = this.tasks.filter(task =>
      task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    // Filter by priority
    if (this.priorityFilter !== 'All') {
      filtered = filtered.filter(task => task.priority === this.priorityFilter);
    }

    // Sort tasks
    filtered = filtered.sort((a, b) => {
      if (this.sortOrder === 'plannedCompletion') {
        const today = new Date().getTime();
        const diffA = Math.abs(new Date(a.plannedCompletionDate).getTime() - today);
        const diffB = Math.abs(new Date(b.plannedCompletionDate).getTime() - today);
        return diffA - diffB; // Closest to today comes first
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return this.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      }
    });

    this.filteredTasks = filtered;
  }

  onSortOrderChange(order: 'newest' | 'oldest' | 'plannedCompletion') {
    this.sortOrder = order;
    this.filterTasks();
  }

  onPriorityFilterChange(priority: 'All' | 'Low' | 'Medium' | 'High') {
    this.priorityFilter = priority;
    this.filterTasks();
  }
  
}