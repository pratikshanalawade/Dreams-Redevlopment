import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as UserRole[];
    
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    if (this.authService.hasRole(expectedRoles)) {
      return true;
    }

    // Role not authorized so redirect to root dashboard
    this.router.navigate(['/dashboard']);
    return false;
  }
}
