import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  hidePassword = true;

  roles = [
    { value: 'owner', label: 'Property Owner (Landowner)' },
    { value: 'renter', label: 'Renter (Tenant)' },
    { value: 'admin', label: 'Authorized Admin' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[+0-9\\s-]{10,15}$')]],
      role: ['owner', Validators.required],
      address: ['', Validators.required],
      propertyName: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Handle conditional validation for Property Name
    this.signupForm.get('role')?.valueChanges.subscribe(val => {
      const propCtrl = this.signupForm.get('propertyName');
      if (val === 'owner' || val === 'renter') {
        propCtrl?.setValidators([Validators.required]);
      } else {
        propCtrl?.clearValidators();
      }
      propCtrl?.updateValueAndValidity();
    });

    // Init validator for default 'owner' role selection
    this.signupForm.get('propertyName')?.setValidators([Validators.required]);
    this.signupForm.get('propertyName')?.updateValueAndValidity();
  }

  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.signup(
      this.f['fullName'].value,
      this.f['email'].value,
      this.f['role'].value,
      this.f['phoneNumber'].value,
      this.f['address'].value,
      this.f['propertyName'].value
    ).subscribe({
      next: (user) => {
        this.loading = false;
        // Direct to their role dashboard
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.role === 'owner') {
          this.router.navigate(['/owner']);
        } else if (user.role === 'renter') {
          this.router.navigate(['/renter']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.error = err.message || 'Registration failed.';
        this.loading = false;
      }
    });
  }
}
