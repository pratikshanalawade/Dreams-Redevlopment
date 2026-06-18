import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Property } from '../../interfaces/property.interface';
import { Agreement } from '../../interfaces/agreement.interface';
import { Payment } from '../../interfaces/payment.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatTabsModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  properties: Property[] = [];
  agreements: Agreement[] = [];
  payments: Payment[] = [];
  
  notificationForm!: FormGroup;
  notificationSuccess = false;

  statusChoices: Property['status'][] = ['Initiated', 'Planning', 'Approvals', 'Demolition', 'Construction', 'Handover'];

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.dataService.getProperties().subscribe(p => this.properties = p);
    this.dataService.getAgreements().subscribe(a => this.agreements = a);
    this.dataService.getPayments().subscribe(pay => this.payments = pay);

    this.notificationForm = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      type: ['info', Validators.required],
      role: ['all', Validators.required]
    });
  }

  // Update property stats
  updateProperty(prop: Property): void {
    this.dataService.updatePropertyStatus(prop.id, prop.status, prop.progressPercentage);
    alert(`Status updated successfully for ${prop.name}!`);
  }

  // Process payouts
  triggerPayout(paymentId: string): void {
    this.dataService.processPayment(paymentId).subscribe(() => {
      // Data handles reload automatically
    });
  }

  // Dispatch global system notifications
  dispatchNotification(): void {
    if (this.notificationForm.invalid) {
      return;
    }

    const val = this.notificationForm.value;
    this.dataService.addNotification({
      title: val.title,
      message: val.message,
      type: val.type,
      role: val.role
    });

    this.notificationSuccess = true;
    this.notificationForm.reset({ type: 'info', role: 'all' });
    setTimeout(() => this.notificationSuccess = false, 3000);
  }
}
