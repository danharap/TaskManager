import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent {
  title: string = '';
  description: string = '';
  priority: string = 'Medium';
  plannedCompletionDate: string = ''; // Add this property

  constructor(
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  createTask() {
    const task = {
      title: this.title,
      description: this.description,
      priority: this.priority,
      plannedCompletionDate: new Date(this.plannedCompletionDate) // Convert to Date object
    };
    this.dialogRef.close(task); // Pass the created task back to the parent
  }

  closeDialog() {
    this.dialogRef.close(); // Close the dialog without doing anything
  }
}