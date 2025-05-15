export interface TaskModel {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: Date;
    priority: string;
    plannedCompletionDate: Date;
}