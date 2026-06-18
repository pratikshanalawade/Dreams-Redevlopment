import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: User | null = null;
  successMessage = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (this.currentUser) {
      this.profileForm = this.formBuilder.group({
        fullName: [this.currentUser.fullName, Validators.required],
        email: [{ value: this.currentUser.email, disabled: true }, [Validators.required, Validators.email]],
        phoneNumber: [this.currentUser.phoneNumber || '', Validators.required],
        propertyName: [{ value: this.currentUser.propertyName || 'N/A', disabled: true }],
        address: [this.currentUser.address || '', Validators.required],
        password: ['']
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    // Update locally simulated user in authState
    if (this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        fullName: this.profileForm.get('fullName')?.value,
        phoneNumber: this.profileForm.get('phoneNumber')?.value,
        address: this.profileForm.get('address')?.value
      };
      
      localStorage.setItem('dreams_user', JSON.stringify(updatedUser));
      // Re-trigger behavior subject state
      this.authService.login(updatedUser.email, 'dummy').subscribe({
        next: () => {},
        error: () => {
          // Explicit manual mock sync
          (this.authService as any).currentUserSubject.next(updatedUser);
        }
      });

      this.successMessage = 'Profile updated successfully!';
      setTimeout(() => this.successMessage = '', 3000);
    }
  }
}
