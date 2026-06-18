import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Payment } from '../../interfaces/payment.interface';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentsList: Payment[] = [];
  currentUserFullName = '';
  totalDisbursed = 0;
  pendingDisbursed = 0;

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.currentUserFullName = user.fullName;
      this.dataService.getPayments().subscribe(payments => {
        // Filter payments belonging to current user (or all if admin)
        this.paymentsList = payments.filter(p => 
          p.recipientName.includes(user.fullName) || user.role === 'admin'
        );

        // Sum calculations
        this.totalDisbursed = this.paymentsList
          .filter(p => p.status === 'Processed')
          .reduce((sum, p) => sum + p.amount, 0);

        this.pendingDisbursed = this.paymentsList
          .filter(p => p.status === 'Pending')
          .reduce((sum, p) => sum + p.amount, 0);
      });
    }
  }

  downloadReceipt(id: string): void {
    alert(`Downloading receipt for transaction ${id}... (Simulated invoice print success)`);
  }
}
