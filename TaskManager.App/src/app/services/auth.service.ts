import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7119/api/auth';
  private userNameSubject = new BehaviorSubject<string | null>(this.getName()); // BehaviorSubject to track username
  userName$ = this.userNameSubject.asObservable(); // Observable for components to subscribe to

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, passwordHash: password }).pipe(
      tap((res) => {
        localStorage.setItem('jwtToken', res.token);
        localStorage.setItem('userRole', res.role);
        localStorage.setItem('userName', res.name);
        this.userNameSubject.next(res.name); // Update the BehaviorSubject with the new username
      })
    );
  }

  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    this.userNameSubject.next(null); // Clear the username in the BehaviorSubject
  }

  getName(): string | null {
    return localStorage.getItem('userName');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, passwordHash: password });
  }

  changeUsername(currentUsername: string, newUsername: string): Observable<any> {
    const payload = { currentUsername, newUsername }; // Create the request body
    return this.http.put(`${this.apiUrl}/username`, payload, {
      headers: { 'Content-Type': 'application/json' } // Ensure Content-Type is set to JSON
    }).pipe(
      tap(() => {
        localStorage.setItem('userName', newUsername); // Update localStorage
        this.userNameSubject.next(newUsername); // Notify subscribers of the new username
      })
    );
  }

  // Change Password (Authenticated User)
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const payload = { currentPassword, newPassword };
    return this.http.put<any>(`${this.apiUrl}/password`, payload);
  }

  // Admin: Change Username for Any User
  adminChangeUsername(userId: number, newUsername: string): Observable<any> {
  const payload = { NewUsername: newUsername }; // Match the backend's expected payload structure
  return this.http.put(`${this.apiUrl}/admin/users/${userId}/username`, payload, {
    headers: { 'Content-Type': 'application/json' } // Ensure Content-Type is set to JSON
  });
}


  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  deleteOwnAccount(): Observable<any> {
  return this.http.delete(`${this.apiUrl}/users/me`, {
    headers: { 'Authorization': `Bearer ${this.getToken()}` }
  });
}

}