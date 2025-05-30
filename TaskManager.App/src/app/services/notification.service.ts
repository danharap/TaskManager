import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NotificationModel {
  id: number;
  userId: number;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = 'https://localhost:7119/api/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(this.apiUrl);
  }

  markAsRead(id: number): Observable<NotificationModel> {
    return this.http.put<NotificationModel>(`${this.apiUrl}/${id}/read`, {});
  }

  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  createNotification(notification: Partial<NotificationModel>): Observable<NotificationModel> {
    return this.http.post<NotificationModel>(this.apiUrl, notification);
  }

  clearAllNotifications(): Observable<any> {
  return this.http.delete(`${this.apiUrl}/clear-all`);
}
}