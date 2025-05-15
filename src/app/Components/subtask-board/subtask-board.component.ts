import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { SubTaskModel } from '../../models/task.model';

@Component({
  selector: 'app-subtask-board',
  templateUrl: './subtask-board.component.html',
  styleUrls: ['./subtask-board.component.css']
})
export class SubtaskBoardComponent implements OnInit {
  taskId!: number;
  subtasks: SubTaskModel[] = [];
  editingSubtaskId: number | null = null;
  editSubtaskData: Partial<SubTaskModel> = {};
  statuses = ['To Do', 'In Progress', 'In Review', 'Complete'];
  newSubTaskTitle = '';
  viewingSubtask: SubTaskModel | null = null;

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit() {
    this.taskId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSubTasks();
  }
    startEditSubtask(subtask: SubTaskModel) {
    this.editingSubtaskId = subtask.id;
    this.editSubtaskData = { ...subtask };
  }

  cancelEditSubtask() {
    this.editingSubtaskId = null;
    this.editSubtaskData = {};
  }


viewSubtask(subtask: SubTaskModel) {
  this.viewingSubtask = subtask;
}

closeViewSubtask() {
  this.viewingSubtask = null;
}
openSubtaskDialog(subtask: SubTaskModel) {
  // Make a copy to avoid editing directly until save
  this.viewingSubtask = { ...subtask };
}

saveViewingSubtask() {
  if (!this.viewingSubtask?.title?.trim()) return;
  this.taskService.updateSubTask(this.viewingSubtask.id, this.viewingSubtask).subscribe(() => {
    this.viewingSubtask = null;
    this.loadSubTasks();
  });
}

  saveEditSubtask() {
    if (!this.editSubtaskData.title?.trim()) return;
    this.taskService.updateSubTask(this.editingSubtaskId!, this.editSubtaskData as SubTaskModel).subscribe(() => {
      this.editingSubtaskId = null;
      this.editSubtaskData = {};
      this.loadSubTasks();
    });
  }

  loadSubTasks() {
    this.taskService.getSubTasks(this.taskId).subscribe(subtasks => {
      this.subtasks = subtasks;
    });
  }

  addSubTask() {
    if (!this.newSubTaskTitle.trim()) return;
    const subTask: SubTaskModel = {
      id: 0,
      title: this.newSubTaskTitle,
      description: '',
      isCompleted: false,
      taskId: this.taskId,
      status: 'To Do'
    };
    this.taskService.addSubTask(this.taskId, subTask).subscribe(() => {
      this.newSubTaskTitle = '';
      this.loadSubTasks();
    });
  }

  moveSubTask(subtask: SubTaskModel, direction: number) {
    const currentIdx = this.statuses.indexOf(subtask.status);
    const newIdx = currentIdx + direction;
    if (newIdx < 0 || newIdx >= this.statuses.length) return;
    subtask.status = this.statuses[newIdx];
    this.taskService.updateSubTask(subtask.id, subtask).subscribe(() => {
      this.loadSubTasks();
    });
  }

  deleteSubTask(subtask: SubTaskModel) {
    this.taskService.deleteSubTask(subtask.id).subscribe(() => {
      this.loadSubTasks();
    });
  }
    getSubtasksByStatus(status: string) {
    return this.subtasks.filter((subtask: any) => subtask.status === status);
  }
}