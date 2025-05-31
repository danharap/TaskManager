import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import {ToastService } from '../../services/toast.service';
import { NotificationService } from '../../services/notification.service'
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  currentUsername = this.authService.getName() || ''; // Fetch current username
  currentPassword = '********'; // Masked password display

  // Username change fields
  enteredCurrentUsername = '';
  newUsername = '';
  confirmNewUsername = '';
  usernameMessage = '';

  // Password change fields
  enteredCurrentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  passwordMessage = '';

  constructor(private authService: AuthService, private themeService: ThemeService, private toastService: ToastService, private notificationService: NotificationService) {}

  
changeUsername() {
  if (this.newUsername !== this.confirmNewUsername) {
    this.usernameMessage = 'New usernames do not match.';
    return;
  }

  this.authService.changeUsername(this.enteredCurrentUsername, this.newUsername).subscribe({
    next: () => {
      this.usernameMessage = 'Username updated successfully.';
      this.currentUsername = this.newUsername; 
      this.clearUsernameFields();
      
      // Add notification and toast
      this.notificationService.createNotification({
        type: 'UsernameChanged',
        message: `Your username was changed to ${this.newUsername}.`,
      }).subscribe();
      this.toastService.show(`Username updated successfully!`, 'UsernameChanged');
    },
    error: (err) => {
      this.usernameMessage = err.error?.Message || 'Failed to update username.';
    }
  });
}

changePassword() {
  if (this.newPassword !== this.confirmNewPassword) {
    this.passwordMessage = 'New passwords do not match.';
    return;
  }

  this.authService.changePassword(this.enteredCurrentPassword, this.newPassword).subscribe({
    next: () => {
      this.passwordMessage = 'Password updated successfully.';
      this.clearPasswordFields();
      
      // Add notification and toast
      this.notificationService.createNotification({
        type: 'PasswordReset',
        message: 'Your password was successfully changed.',
      }).subscribe();
      this.toastService.show('Password updated successfully!', 'PasswordReset');
    },
    error: (err) => {
      this.passwordMessage = err.error?.Message || 'Failed to update password.';
    }
  });
}


  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }


  // Clear Username Fields
  clearUsernameFields() {
    this.enteredCurrentUsername = '';
    this.newUsername = '';
    this.confirmNewUsername = '';
  }

  // Clear Password Fields
  clearPasswordFields() {
    this.enteredCurrentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

    deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.authService.deleteOwnAccount().subscribe({
        next: () => {
          // Optionally clear local storage and redirect to login
          localStorage.clear();
          window.location.href = '/login';
        },
        error: (err) => {
          alert(err.error?.Message || 'Failed to delete account.');
        }
      });
    }
  }
}