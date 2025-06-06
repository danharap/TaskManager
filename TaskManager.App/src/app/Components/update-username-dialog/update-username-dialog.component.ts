import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update-username-dialog',
  templateUrl: './update-username-dialog.component.html',
  styleUrls: ['./update-username-dialog.component.css']
})
export class UpdateUsernameDialogComponent {
  newUsername: string = '';

  constructor(
    private dialogRef: MatDialogRef<UpdateUsernameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any },
    private http: HttpClient
  ) {}
  updateUsername() {
  this.http.put(`${environment.apiUrl}/auth/admin/users/${this.data.user.id}/username`, { newUsername: this.newUsername }).subscribe({
    next: () => {
      alert('Username updated successfully');
      this.dialogRef.close(true); // Close the dialog and notify success
    },
    error: (err) => {
      console.error('Failed to update username:', err);
      alert(err.error?.Message || 'Failed to update username');
    }
  });
}

  cancel() {
    this.dialogRef.close(false); // Close the dialog without saving
  }
}