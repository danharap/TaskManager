import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
  <div *ngIf="show" [@fadeInOut] class="toast" [ngClass]="type">
    <span class="toast-icon">
      <ng-container [ngSwitch]="type">
        <span *ngSwitchCase="'TaskCreated'" class="material-icons">add_circle</span>
        <span *ngSwitchCase="'TaskDeleted'" class="material-icons">delete</span>
        <span *ngSwitchCase="'TaskUpdated'" class="material-icons">edit</span>
        <span *ngSwitchCase="'SubTaskCreated'" class="material-icons">playlist_add</span>
        <span *ngSwitchCase="'SubTaskDeleted'" class="material-icons">remove_circle</span>
        <span *ngSwitchCase="'SubTaskStatusChanged'" class="material-icons">sync_alt</span>
        <span *ngSwitchCase="'FileUploaded'" class="material-icons">cloud_upload</span>
        <span *ngSwitchCase="'FileDeleted'" class="material-icons">delete</span>
        <span *ngSwitchCase="'PasswordReset'" class="material-icons">lock_reset</span>
        <span *ngSwitchDefault class="material-icons">notifications</span>
      </ng-container>
    </span>
    <span class="toast-message">{{ message }}</span>
  </div>
  `,
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, 30px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'translate(-50%, 0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease', style({ opacity: 0, transform: 'translate(-50%, 30px)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {
  show = false;
  message = '';
  type: string = 'success';
  timeout: any;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toastState$.subscribe(({ message, type }) => {
      this.message = message;
      this.type = type || 'success';
      this.show = true;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.show = false, 2500);
    });
  }
}