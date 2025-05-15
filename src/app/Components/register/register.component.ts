import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';

  constructor(private authService: AuthService, private location: Location,
      private router: Router) {}

  onRegister() {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.authService.login(this.username, this.password).subscribe({
          next: () => {
            this.router.navigate(['/dashboard']); // Redirect to the dashboard after login
          },
          error: () => {
            this.message = 'Registration successful, but login failed. Please try logging in manually.';
          }
        });
      },
      error: err => {
        this.message = err.error?.Message || 'Registration failed.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

}