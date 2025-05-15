// filepath: src/app/models/task.model.ts
export interface SubTaskModel {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  taskId: number;
  status: string;
}

export interface TaskModel {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  priority: string;
  plannedCompletionDate: Date;
  subTasks?: SubTaskModel[];
}