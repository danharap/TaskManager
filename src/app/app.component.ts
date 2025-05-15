import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { TaskModel } from './models/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FullstackApp';
  tasks: TaskModel[] = [];
  selectedTask: TaskModel | null = null;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.getTasks();
  }

  isAuthPage(): boolean {
    const authPages = ['/login', '/register'];
    return authPages.includes(this.router.url);
  }

  getTasks() {
    this.taskService.getTasks().subscribe({
      next: (response) => {
        this.tasks = response;
        console.log('Tasks fetched:', response);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  editTask(task: TaskModel) {
    this.selectedTask = { ...task }; // Clone the task to avoid directly modifying the list
  }

  onTaskUpdated() {
    this.getTasks(); // Refresh the task list
    this.selectedTask = null; // Clear the selected task
  }

  onCancelUpdate() {
    this.selectedTask = null; // Clear the selected task
  }

  addTask() {
    const newTask: TaskModel = {
      id: 0, // Backend will assign the ID
      title: 'New Task',
      description: 'This is a new task',
      isCompleted: false,
      createdAt: new Date(),
      priority: 'Low',
      plannedCompletionDate: new Date(new Date().setDate(new Date().getDate() + 7)) // Default to 7 days from now
    };

    this.taskService.addTask(newTask).subscribe({
      next: (response) => {
        this.tasks.push(response);
        console.log('Task added:', response);
      },
      error: (error) => {
        console.error('Error adding task:', error);
      }
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
        console.log(`Task with ID ${id} deleted.`);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }

  
}