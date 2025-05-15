import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { TaskModel } from '../models/task.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:7119/api/tasks';

  constructor(private dataService: DataService, private http: HttpClient) {}


  getAllTasks(token: string | null): Observable<TaskModel[]> {
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.get<TaskModel[]>(`${this.apiUrl}/all`, { headers });
  }
  // Get all tasks
  getTasks(): Observable<TaskModel[]> {
    return this.dataService.getTasks();
  }

  // Add a new task
  addTask(task: TaskModel): Observable<TaskModel> {
    return this.dataService.addTask(task);
  }

  // Update an existing task
  updateTask(id: number, task: TaskModel): Observable<TaskModel> {
    return this.dataService.updateTask(id, task);
  }

  // Delete a task
  deleteTask(id: number): Observable<any> {
    return this.dataService.deleteTask(id);
  }
}