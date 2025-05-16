import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-fab-create-task',
  templateUrl: './fab-create-task.component.html',
  styleUrls: ['./fab-create-task.component.css']
})
export class FabCreateTaskComponent {
  @Output() createClicked = new EventEmitter<void>();

  onClick() {
    this.createClicked.emit();
  }
}