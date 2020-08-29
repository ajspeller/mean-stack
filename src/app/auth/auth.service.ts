import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { AuthData } from './AuthData.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000';
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;

  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string): Observable<any> {
    const data: AuthData = { email, password };
    return this.http.post<any>(`${this.url}/api/user/signup`, data);
  }

  login(
    email: string,
    password: string
  ): Observable<{ token: string; expiresIn: number }> {
    const data: AuthData = { email, password };
    return this.http.post<{ token: string; expiresIn: number }>(
      `${this.url}/api/user/login`,
      data
    );
  }

  setToken(token: string): void {
    if (!token) {
      return;
    }
    this.token = token;
    this.authStatusListener.next(true);
    this.isAuthenticated = true;
  }

  setTokenTimer(tokenTimer): void {
    this.tokenTimer = tokenTimer;
  }

  logout(): void {
    this.token = null;
    this.authStatusListener.next(false);
    this.isAuthenticated = false;
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getToken(): string {
    return this.token;
  }

  getAuthStatusListener$(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(expiresIn);
    if (expiresIn > 0) {
      // future date
      this.setToken(authInformation.token);
      this.setAuthTimer(expiresIn);
    }
  }

  setAuthTimer(duration: number): void {
    console.log(`Setting timer: ${duration / 1000} seconds`);
    const timer = setTimeout(() => {
      this.logout();
    }, duration);
    this.setTokenTimer(timer);
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData(): { token: string; expirationDate: Date } {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate),
    };
  }
}
