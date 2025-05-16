import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private location: Location) {
    // Show spinner during route changes (register <-> login)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;
      }
    });
  }

  onRegister() {
    this.isLoading = true;
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.authService.login(this.username, this.password).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.message = 'Registration successful, but login failed. Please try logging in manually.';
          }
        });
      },
      error: err => {
        this.isLoading = false;
        this.message = err.error?.Message || 'Registration failed.';
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

}