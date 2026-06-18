import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl = '';
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // Easy access getter for form fields
  get f() { return this.loginForm.controls; }

  // Fast demo sign-in helper
  loginAs(role: 'admin' | 'owner' | 'renter'): void {
    let email = '';
    let pass = '';
    if (role === 'admin') {
      email = 'admin@dreams.com';
      pass = 'admin123';
    } else if (role === 'owner') {
      email = 'owner@dreams.com';
      pass = 'owner123';
    } else if (role === 'renter') {
      email = 'renter@dreams.com';
      pass = 'renter123';
    }
    
    this.loginForm.patchValue({ email, password: pass });
    this.onSubmit();
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: (user) => {
          this.loading = false;
          // Route based on user role to make the workflow smoother
          if (user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (user.role === 'owner') {
            this.router.navigate(['/owner']);
          } else if (user.role === 'renter') {
            this.router.navigate(['/renter']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (err) => {
          this.error = err.message || 'Authentication failed.';
          this.loading = false;
        }
      });
  }
}
