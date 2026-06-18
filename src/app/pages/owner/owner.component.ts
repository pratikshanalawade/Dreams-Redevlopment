import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Property } from '../../interfaces/property.interface';
import { Agreement } from '../../interfaces/agreement.interface';
import { Payment } from '../../interfaces/payment.interface';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-owner',
  standalone: true,
  imports: [CommonModule, RouterLink, MatStepperModule, MatButtonModule, MatIconModule, MatListModule],
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {
  ownerProperty: Property | null = null;
  ownerAgreements: Agreement[] = [];
  ownerPayments: Payment[] = [];
  
  // Hardcoded stages mapped to stepper indices
  stagesList = ['Initiated', 'Planning', 'Approvals', 'Demolition', 'Construction', 'Handover'];
  currentStepIndex = 0;

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user && user.propertyName) {
      this.dataService.getProperties().subscribe(properties => {
        this.ownerProperty = properties.find(p => 
          p.name.toLowerCase().includes(user.propertyName!.toLowerCase()) ||
          user.propertyName!.toLowerCase().includes(p.name.toLowerCase())
        ) || null;

        if (this.ownerProperty) {
          this.currentStepIndex = this.stagesList.indexOf(this.ownerProperty.status);
          if (this.currentStepIndex === -1) this.currentStepIndex = 0;
        }
      });

      this.dataService.getAgreements().subscribe(agreements => {
        this.ownerAgreements = agreements.filter(a => 
          a.parties.some(p => p.includes(user.fullName))
        );
      });

      this.dataService.getPayments().subscribe(payments => {
        this.ownerPayments = payments.filter(p => 
          p.recipientName.includes(user.fullName)
        );
      });
    }
  }

  signContract(agreementId: string): void {
    this.dataService.signAgreement(agreementId).subscribe(updatedAgr => {
      // Re-filter list
      const user = this.authService.currentUserValue;
      if (user) {
        this.dataService.getAgreements().subscribe(agreements => {
          this.ownerAgreements = agreements.filter(a => 
            a.parties.some(p => p.includes(user.fullName))
          );
        });
      }
    });
  }
}
