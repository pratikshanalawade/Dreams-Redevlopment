import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User, UserRole } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  // Mock list of registered users for simulation
  private mockUsers: User[] = [
    {
      id: 'usr_1',
      email: 'admin@dreams.com',
      fullName: 'Vikram Malhotra (Admin)',
      role: 'admin',
      phoneNumber: '+91 98765 43210'
    },
    {
      id: 'usr_2',
      email: 'owner@dreams.com',
      fullName: 'Elena Jones (Property Owner)',
      role: 'owner',
      phoneNumber: '+91 98123 45678',
      propertyName: 'Dreams Heights, Tower A',
      address: 'Plot 45, Sector 18, Worli, Mumbai'
    },
    {
      id: 'usr_3',
      email: 'renter@dreams.com',
      fullName: 'Marcus Thorne (Renter)',
      role: 'renter',
      phoneNumber: '+91 97654 32109',
      propertyName: 'Dreams Heights, Tower A, Flat 402',
      address: 'Flat 402, Dreams Heights, Sector 18, Worli, Mumbai'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('dreams_user');
      if (savedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('dreams_user');
        }
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  public hasRole(roles: UserRole[]): boolean {
    const user = this.currentUserValue;
    return !!(user && roles.includes(user.role));
  }

  login(email: string, password: string): Observable<User> {
    // Basic verification: check if email exists in mock list
    const foundUser = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      // Create a mock token
      const token = 'mock-jwt-token-for-' + foundUser.role + '-' + Math.random().toString(36).substring(2);
      const authenticatedUser: User = {
        ...foundUser,
        token
      };

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('dreams_user', JSON.stringify(authenticatedUser));
      }
      this.currentUserSubject.next(authenticatedUser);
      return of(authenticatedUser);
    } else {
      return throwError(() => new Error('Invalid email or password. Hint: Use admin@dreams.com, owner@dreams.com, or renter@dreams.com.'));
    }
  }

  signup(fullName: string, email: string, role: UserRole, phone: string, address: string, propertyName?: string): Observable<User> {
    const emailExists = this.mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return throwError(() => new Error('Email already exists.'));
    }

    const newUser: User = {
      id: 'usr_' + (this.mockUsers.length + 1),
      email,
      fullName,
      role,
      phoneNumber: phone,
      address,
      propertyName
    };

    this.mockUsers.push(newUser);

    // Auto-login after successful registration
    const token = 'mock-jwt-token-for-' + newUser.role + '-' + Math.random().toString(36).substring(2);
    const authenticatedUser: User = {
      ...newUser,
      token
    };

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('dreams_user', JSON.stringify(authenticatedUser));
    }
    this.currentUserSubject.next(authenticatedUser);
    return of(authenticatedUser);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('dreams_user');
    }
    this.currentUserSubject.next(null);
  }
}
