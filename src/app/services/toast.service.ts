import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<{ message: string, type?: string }>();
  toastState$ = this.toastSubject.asObservable();

  show(message: string, type: string = 'success') {
    this.toastSubject.next({ message, type });
  }
}