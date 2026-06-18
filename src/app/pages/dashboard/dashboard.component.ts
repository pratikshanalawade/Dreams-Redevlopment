import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { User } from '../../interfaces/user.interface';
import { Property } from '../../interfaces/property.interface';
import { Agreement } from '../../interfaces/agreement.interface';
import { Payment } from '../../interfaces/payment.interface';
import { AppNotification } from '../../interfaces/notification.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userProperty: Property | null = null;
  recentAgreements: Agreement[] = [];
  recentPayments: Payment[] = [];
  recentNotifications: AppNotification[] = [];
  
  // Overall system overview (for admin role or general view)
  totalProperties = 0;
  totalAgreements = 0;
  totalPaymentsAmount = 0;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    // Load data from services
    this.dataService.getProperties().subscribe(properties => {
      this.totalProperties = properties.length;
      
      // If user is owner or renter, locate their property matching propertyName
      if (this.currentUser && this.currentUser.propertyName) {
        this.userProperty = properties.find(p => 
          p.name.toLowerCase().includes(this.currentUser!.propertyName!.toLowerCase()) ||
          this.currentUser!.propertyName!.toLowerCase().includes(p.name.toLowerCase())
        ) || null;
      }
    });

    this.dataService.getAgreements().subscribe(agreements => {
      this.totalAgreements = agreements.length;
      // Filter agreements involving the current user
      if (this.currentUser) {
        this.recentAgreements = agreements.filter(a => 
          a.parties.some(p => p.includes(this.currentUser!.fullName))
        ).slice(0, 3);
      }
    });

    this.dataService.getPayments().subscribe(payments => {
      // Calculate total payments made in system
      this.totalPaymentsAmount = payments
        .filter(p => p.status === 'Processed')
        .reduce((sum, p) => sum + p.amount, 0);

      // Filter payments belonging to current user
      if (this.currentUser) {
        this.recentPayments = payments.filter(p => 
          p.recipientName.includes(this.currentUser!.fullName)
        ).slice(0, 3);
      }
    });

    this.dataService.getNotifications().subscribe(notifications => {
      // Filter role notifications or general ones
      if (this.currentUser) {
        this.recentNotifications = notifications.filter(n => 
          n.role === 'all' || n.role === this.currentUser!.role
        ).slice(0, 3);
      }
    });
  }

  // Helper method to navigate to role portal
  navigateToPortal(): void {
    if (this.currentUser) {
      this.router.navigate([`/${this.currentUser.role}`]);
    }
  }
}
