import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateTaskComponent } from '../create-task/create-task.component';

@Component({
  selector: 'app-fab-create-task',
  templateUrl: './fab-create-task.component.html',
  styleUrls: ['./fab-create-task.component.css']
})
export class FabCreateTaskComponent {
  constructor(private dialog: MatDialog) {}

  openCreateTaskDialog() {
    this.dialog.open(CreateTaskComponent, {
      width: '400px'
    });
  }
}