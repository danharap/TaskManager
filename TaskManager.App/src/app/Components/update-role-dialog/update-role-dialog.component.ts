import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update-role-dialog',
  templateUrl: './update-role-dialog.component.html',
  styleUrls: ['./update-role-dialog.component.css']
})
export class UpdateRoleDialogComponent {
  newRole: string = '';

  constructor(
    private dialogRef: MatDialogRef<UpdateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any },
    private http: HttpClient
  ) {}
  updateRole() {
  this.http.put(`${environment.apiUrl}/auth/users/${this.data.user.id}/role`, `"${this.newRole}"`, {
    headers: { 'Content-Type': 'application/json' } // Ensure the Content-Type is set to JSON
  }).subscribe({
    next: () => {
      alert('Role updated successfully');
      this.dialogRef.close(true); // Close the dialog and notify success
    },
    error: (err) => {
      console.error('Failed to update role:', err);
      alert(err.error?.Message || 'Failed to update role');
    }
  });
}

  cancel() {
    this.dialogRef.close(false); // Close the dialog without saving
  }
}