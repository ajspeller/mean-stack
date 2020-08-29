import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from './../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogin(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = form.value;
    this.authService.login(email, password).subscribe((res) => {
      console.log(res);
      const { token } = res;
      if (!token) {
        return;
      }
      const expiresInDuration = Number(res.expiresIn);
      this.authService.setAuthTimer(expiresInDuration);
      this.authService.setToken(token);
      const expirationDate = new Date(new Date().getTime() + expiresInDuration);
      console.log(expirationDate);
      this.authService.saveAuthData(token, expirationDate);
      this.router.navigate(['/']);
    });
  }
}
