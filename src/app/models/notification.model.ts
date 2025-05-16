export interface NotificationModel {
  id: number;
  userId: number;
  type: string; // e.g., "TaskCreated", "FileUploaded", etc.
  message: string;
  createdAt: string;
  isRead: boolean;
}