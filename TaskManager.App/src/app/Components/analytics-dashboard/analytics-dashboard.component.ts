import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskModel } from '../../models/task.model';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.css']
})
export class AnalyticsDashboardComponent implements OnInit {
  totalTasks: number = 0;
  completedTasks: number = 0;
  overdueTasks: number = 0;
  priorityDistribution: { [key: string]: number } = { Low: 0, Medium: 0, High: 0 };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadAnalytics();
  }

  loadAnalytics(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks: TaskModel[]) => {
        this.totalTasks = tasks.length;
        this.completedTasks = tasks.filter(task => task.isCompleted).length;
        this.overdueTasks = tasks.filter(task => !task.isCompleted && new Date(task.plannedCompletionDate) < new Date()).length;

        // Calculate priority distribution
        this.priorityDistribution = { Low: 0, Medium: 0, High: 0 };
        tasks.forEach(task => {
          if (task.priority in this.priorityDistribution) {
            this.priorityDistribution[task.priority]++;
          }
        });
      },
      error: (err) => console.error('Failed to load analytics:', err)
    });
  }
}