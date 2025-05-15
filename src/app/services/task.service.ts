import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { TaskModel } from '../models/task.model';
import { SubTaskModel } from '../models/task.model';
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

  getSubTasks(taskId: number): Observable<SubTaskModel[]> {
  return this.http.get<SubTaskModel[]>(`${this.apiUrl}/${taskId}/subtasks`);
}

addSubTask(taskId: number, subTask: SubTaskModel): Observable<SubTaskModel> {
  return this.http.post<SubTaskModel>(`${this.apiUrl}/${taskId}/subtasks`, subTask);
}

updateSubTask(subTaskId: number, subTask: SubTaskModel): Observable<SubTaskModel> {
  return this.http.put<SubTaskModel>(`${this.apiUrl}/subtasks/${subTaskId}`, subTask);
}

deleteSubTask(subTaskId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/subtasks/${subTaskId}`);
}
}