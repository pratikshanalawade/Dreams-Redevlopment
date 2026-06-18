import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Agreement } from '../../interfaces/agreement.interface';
import { Payment } from '../../interfaces/payment.interface';
import { AppNotification } from '../../interfaces/notification.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-renter',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './renter.component.html',
  styleUrls: ['./renter.component.css']
})
export class RenterComponent implements OnInit {
  renterAgreements: Agreement[] = [];
  renterPayments: Payment[] = [];
  renterNotices: AppNotification[] = [];
  currentUserFullName = '';
  propertyName = '';

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.currentUserFullName = user.fullName;
      this.propertyName = user.propertyName || 'Unlinked Property';

      this.dataService.getAgreements().subscribe(agreements => {
        this.renterAgreements = agreements.filter(a => 
          a.parties.some(p => p.includes(user.fullName))
        );
      });

      this.dataService.getPayments().subscribe(payments => {
        this.renterPayments = payments.filter(p => 
          p.recipientName.includes(user.fullName)
        );
      });

      this.dataService.getNotifications().subscribe(notifications => {
        // Renters get renter-specific or global warnings
        this.renterNotices = notifications.filter(n => 
          n.role === 'renter' || n.role === 'all'
        );
      });
    }
  }

  signAgreement(id: string): void {
    this.dataService.signAgreement(id).subscribe(() => {
      // Refresh list
      const user = this.authService.currentUserValue;
      if (user) {
        this.dataService.getAgreements().subscribe(agreements => {
          this.renterAgreements = agreements.filter(a => 
            a.parties.some(p => p.includes(user.fullName))
          );
        });
      }
    });
  }
}
