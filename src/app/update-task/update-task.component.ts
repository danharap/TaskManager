import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskModel } from '../models/task.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent {
  task: TaskModel;

  constructor(
    private dialogRef: MatDialogRef<UpdateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: TaskModel },
    private dataService: DataService
  ) {
    this.task = { ...data.task }; // Clone the task to avoid modifying the original directly
  }

  updateTask() {
    this.dataService.updateTask(this.task.id, this.task).subscribe({
      next: () => {
        console.log('Task updated successfully');
        this.dialogRef.close(true); // Close the dialog and notify the parent
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  cancel() {
    this.dialogRef.close(false); // Close the dialog without saving
  }
}