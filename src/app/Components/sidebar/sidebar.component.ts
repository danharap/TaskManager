import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string | null = null;
  isDarkMode: boolean = false;

  constructor(private authService: AuthService, private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    console.log('Sidebar dark mode:', this.isDarkMode); // Debugging log
    this.userRole = this.authService.getRole(); // Retrieve the user's role
  }
}