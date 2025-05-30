import { Component, OnInit } from '@angular/core';
import { NotificationService, NotificationModel } from '../../services/notification.service';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: NotificationModel[] = [];

  constructor(private notificationService: NotificationService, private toastService: ToastService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => this.notifications = data,
      error: () => this.notifications = []
    });
  }

  markAsRead(notification: NotificationModel) {
    this.notificationService.markAsRead(notification.id).subscribe(() => {
      notification.isRead = true;
    });
  }

  // Make sure your existing deleteNotification method looks like this:
deleteNotification(notification: NotificationModel) {
  this.notificationService.deleteNotification(notification.id).subscribe({
    next: () => {
      this.notifications = this.notifications.filter(n => n.id !== notification.id);
      this.toastService.show('Notification deleted', 'info');
    },
    error: () => {
      this.toastService.show('Failed to delete notification', 'error');
    }
  });
}

// Add a new method for clearing all notifications
clearAllNotifications() {
  if (confirm('Are you sure you want to delete all notifications?')) {
    this.notificationService.clearAllNotifications().subscribe({
      next: (response) => {
        this.notifications = [];
        this.toastService.show('All notifications cleared', 'info');
      },
      error: () => {
        this.toastService.show('Failed to clear notifications', 'error');
        this.loadNotifications();
      }
    });
  }
}

getNotificationClass(type: string): string {
  // Action-based categorization for notifications
  if (type.includes('Created') || type.includes('FileUploaded')) {
    return 'notification-created';  // Blue for creation actions
  } else if (type.includes('Deleted')) {
    return 'notification-deleted';  // Red for deletion actions
  } else if (type.includes('Updated') || type.includes('Changed') || type.includes('Password') || type.includes('Username')) {
    return 'notification-updated';  // Orange for updates
  } else {
    return 'notification-default';  // Default styling
  }
}

getNotificationTitle(type: string): string {
  switch (type) {
    case 'TaskCreated': return 'Task Created';
    case 'TaskDeleted': return 'Task Deleted';
    case 'TaskUpdated': return 'Task Updated';
    case 'SubTaskCreated': return 'Subtask Created';
    case 'SubTaskDeleted': return 'Subtask Deleted';
    case 'SubTaskUpdated': return 'Subtask Updated';
    case 'SubTaskStatusChanged': return 'Subtask Status Changed';
    case 'FileUploaded': return 'File Uploaded';
    case 'FileDeleted': return 'File Deleted';
    case 'PasswordReset': return 'Password Reset';
    case 'UsernameChanged': return 'Username Changed';
    default: return 'Notification';
  }
}
}