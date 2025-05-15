import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

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

  constructor(private authService: AuthService, private themeService: ThemeService) {}

  // Change Username
    changeUsername() {
      if (this.newUsername !== this.confirmNewUsername) {
        this.usernameMessage = 'New usernames do not match.';
        return;
      }

      this.authService.changeUsername(this.enteredCurrentUsername, this.newUsername).subscribe({
        next: () => {
          this.usernameMessage = 'Username updated successfully.';
          this.currentUsername = this.newUsername; // Update displayed username
          this.clearUsernameFields();
        },
        error: (err) => {
          this.usernameMessage = err.error?.Message || 'Failed to update username.';
        }
      });
    }
      toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  // Change Password
  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordMessage = 'New passwords do not match.';
      return;
    }

    this.authService.changePassword(this.enteredCurrentPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordMessage = 'Password updated successfully.';
        this.clearPasswordFields();
      },
      error: (err) => {
        this.passwordMessage = err.error?.Message || 'Failed to update password.';
      }
    });
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
}