import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { TaskModel } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { startOfDay, endOfDay, addMonths, subMonths } from 'date-fns';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendarContainer') calendarContainer!: ElementRef; // Reference to the calendar container
  viewDate: Date = new Date(); // Current date
  events: CalendarEvent[] = []; // Events to display on the calendar
  maxTitleLength: number = 10; // Default maximum title length

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    this.updateMaxTitleLength(); // Update the max title length after the view is initialized
    window.addEventListener('resize', () => this.updateMaxTitleLength()); // Adjust on window resize
  }

  updateMaxTitleLength(): void {
    if (this.calendarContainer) {
      const cellWidth = this.calendarContainer.nativeElement.querySelector('.custom-day-cell')?.offsetWidth || 100;
      this.maxTitleLength = Math.floor(cellWidth / 20); // Adjust based on cell width (10px per character as an estimate)
      this.loadTasks(); // Reload tasks to apply the new truncation length
    }
  }

  isToday(date: Date): boolean {
    return isSameDay(date, new Date()); // Check if the given date is today
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks: TaskModel[]) => {
        this.events = tasks.map((task) => ({
          start: startOfDay(new Date(task.plannedCompletionDate)),
          end: endOfDay(new Date(task.plannedCompletionDate)),
          title: this.truncateTitle(task.title), // Truncate the title
          color: {
            primary: this.getPriorityColor(task.priority),
            secondary: '#fdf1ba'
          },
          meta: task
        }));
      },
      error: (err) => console.error('Failed to load tasks:', err)
    });
  }

  truncateTitle(title: string): string {
    if (title.length > this.maxTitleLength) {
      return title.slice(0, this.maxTitleLength) + '...'; // Truncate and add ellipsis
    }
    return title;
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'High':
        return '#dc3545'; // Red
      case 'Medium':
        return '#ffc107'; // Yellow
      case 'Low':
        return '#28a745'; // Green
      default:
        return '#007bff'; // Default blue
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    const task = event.meta as TaskModel;
    this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { task }
    });
  }

  handleDayClick(day: any): void {
    const selectedDate = day.date;
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '400px',
      data: { plannedCompletionDate: selectedDate }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.addTask(result).subscribe({
          next: (response) => {
            console.log('Task created:', response);
            this.loadTasks(); // Reload tasks to update the calendar
          },
          error: (err) => console.error('Failed to create task:', err)
        });
      }
    });
  }

  // Navigate to the previous month
  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
  }

  // Navigate to the next month
  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
  }
}

function isSameDay(date: Date, arg1: Date): boolean {
  throw new Error('Function not implemented.');
}
