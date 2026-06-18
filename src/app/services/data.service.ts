import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Property } from '../interfaces/property.interface';
import { Agreement } from '../interfaces/agreement.interface';
import { Payment } from '../interfaces/payment.interface';
import { AppNotification } from '../interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Mock Properties
  private properties = new BehaviorSubject<Property[]>([
    {
      id: 'prop_1',
      name: 'Dreams Heights, Tower A',
      address: 'Plot 45, Sector 18, Worli, Mumbai',
      ownerName: 'Elena Jones',
      ownerId: 'usr_2',
      status: 'Approvals',
      progressPercentage: 35,
      startDate: '2026-01-10',
      expectedCompletionDate: '2028-06-30',
      totalArea: '45,000 sq ft',
      rentersCount: 12
    },
    {
      id: 'prop_2',
      name: 'Regency Plaza',
      address: 'Sector 5, Salt Lake, Kolkata',
      ownerName: 'Rahul Banerjee',
      ownerId: 'usr_owner_rahul',
      status: 'Construction',
      progressPercentage: 62,
      startDate: '2025-03-15',
      expectedCompletionDate: '2027-02-28',
      totalArea: '80,000 sq ft',
      rentersCount: 24
    },
    {
      id: 'prop_3',
      name: 'Orchid Residency',
      address: 'Jubilee Hills, Hyderabad',
      ownerName: 'Srinivas Rao',
      ownerId: 'usr_owner_sri',
      status: 'Planning',
      progressPercentage: 15,
      startDate: '2026-05-01',
      expectedCompletionDate: '2029-01-15',
      totalArea: '60,000 sq ft',
      rentersCount: 8
    }
  ]);

  // Mock Agreements
  private agreements = new BehaviorSubject<Agreement[]>([
    {
      id: 'agr_1',
      propertyId: 'prop_1',
      propertyName: 'Dreams Heights, Tower A',
      parties: ['Vikram Malhotra (Admin)', 'Elena Jones (Owner)'],
      type: 'Redevelopment',
      status: 'Signed',
      signedDate: '2026-02-14',
      expiryDate: '2028-12-31',
      pdfUrl: 'mock_redevelopment_agreement.pdf',
      terms: [
        'Landowner receives 40% share of redeveloped built-up area.',
        'Developer pays rent allowance of $1,500/month during construction.',
        'Estimated project completion within 30 months from approval date.',
        'Standard penalty of $500/day for any handover delay beyond 3 months grace period.'
      ]
    },
    {
      id: 'agr_2',
      propertyId: 'prop_1',
      propertyName: 'Dreams Heights, Tower A, Flat 402',
      parties: ['Elena Jones (Owner)', 'Marcus Thorne (Renter)'],
      type: 'Tenant Reallocation',
      status: 'Signed',
      signedDate: '2026-03-01',
      expiryDate: '2027-02-28',
      pdfUrl: 'mock_tenant_reallocation_agreement.pdf',
      terms: [
        'Renter agrees to vacate the premises by 2026-04-15.',
        'Renter receives alternative accommodation allowance of $1,000/month.',
        'Priority placement for new rental lease post redevelopment construction.'
      ]
    }
  ]);

  // Mock Payments
  private payments = new BehaviorSubject<Payment[]>([
    {
      id: 'pay_1',
      propertyId: 'prop_1',
      propertyName: 'Dreams Heights, Tower A',
      recipientName: 'Elena Jones',
      amount: 1500,
      type: 'Rent Allowance',
      status: 'Processed',
      date: '2026-05-01',
      transactionHash: '0x9a8f7e6d5c4b3a2'
    },
    {
      id: 'pay_2',
      propertyId: 'prop_1',
      propertyName: 'Dreams Heights, Tower A',
      recipientName: 'Elena Jones',
      amount: 1500,
      type: 'Rent Allowance',
      status: 'Processed',
      date: '2026-06-01',
      transactionHash: '0x1b2c3d4e5f6a7b8'
    },
    {
      id: 'pay_3',
      propertyId: 'prop_1',
      propertyName: 'Dreams Heights, Tower A, Flat 402',
      recipientName: 'Marcus Thorne',
      amount: 1000,
      type: 'Rent Allowance',
      status: 'Processed',
      date: '2026-05-05',
      transactionHash: '0x3c4d5e6f7a8b9c0'
    },
    {
      id: 'pay_4',
      propertyId: 'prop_1',
      propertyName: 'Dreams Heights, Tower A, Flat 402',
      recipientName: 'Marcus Thorne',
      amount: 1000,
      type: 'Rent Allowance',
      status: 'Pending',
      date: '2026-06-05'
    }
  ]);

  // Mock Notifications
  private notifications = new BehaviorSubject<AppNotification[]>([
    {
      id: 'ntf_1',
      title: 'Structural Design Approved',
      message: 'The structural designs for Dreams Heights have been vetted and approved by municipal engineers.',
      type: 'success',
      timestamp: '2026-06-16T10:00:00Z',
      isRead: false,
      role: 'all'
    },
    {
      id: 'ntf_2',
      title: 'Rent Allowance Credited',
      message: 'Your monthly rent allowance of $1,500 has been credited to your bank account.',
      type: 'info',
      timestamp: '2026-06-01T09:15:00Z',
      isRead: true,
      role: 'owner'
    },
    {
      id: 'ntf_3',
      title: 'Demolition Phase Commencing',
      message: 'Notice: Demolition of the existing structure is scheduled to start on June 25, 2026. Please ensure all belongings are cleared.',
      type: 'warning',
      timestamp: '2026-06-15T14:30:00Z',
      isRead: false,
      role: 'all'
    },
    {
      id: 'ntf_4',
      title: 'Agreement Pending Signature',
      message: 'A new settlement document is ready for your signature.',
      type: 'info',
      timestamp: '2026-06-17T08:00:00Z',
      isRead: false,
      role: 'renter'
    }
  ]);

  constructor() {}

  // Properties API
  getProperties(): Observable<Property[]> {
    return this.properties.asObservable();
  }

  getPropertyById(id: string): Observable<Property | undefined> {
    return of(this.properties.value.find(p => p.id === id));
  }

  updatePropertyStatus(id: string, status: Property['status'], progress: number): void {
    const list = this.properties.value.map(p => {
      if (p.id === id) {
        return { ...p, status, progressPercentage: progress };
      }
      return p;
    });
    this.properties.next(list);

    // Create system notification
    this.addNotification({
      title: 'Project Status Updated',
      message: `Property ${id} status changed to ${status} (${progress}% completed)`,
      type: 'info',
      role: 'all'
    });
  }

  addProperty(property: Omit<Property, 'id'>): Observable<Property> {
    const newProperty: Property = {
      ...property,
      id: 'prop_' + (this.properties.value.length + 1)
    };
    this.properties.next([...this.properties.value, newProperty]);
    return of(newProperty);
  }

  // Agreements API
  getAgreements(): Observable<Agreement[]> {
    return this.agreements.asObservable();
  }

  signAgreement(id: string): Observable<Agreement> {
    let signedAgr: Agreement | null = null;
    const list = this.agreements.value.map(a => {
      if (a.id === id) {
        signedAgr = { ...a, status: 'Signed' as const, signedDate: new Date().toISOString().split('T')[0] };
        return signedAgr;
      }
      return a;
    });
    this.agreements.next(list);
    
    this.addNotification({
      title: 'Agreement Signed',
      message: `The agreement "${signedAgr ? (signedAgr as Agreement).type : id}" has been digitally signed successfully.`,
      type: 'success',
      role: 'all'
    });

    return of(signedAgr || this.agreements.value[0]);
  }

  createAgreement(agreement: Omit<Agreement, 'id'>): Observable<Agreement> {
    const newAgr: Agreement = {
      ...agreement,
      id: 'agr_' + (this.agreements.value.length + 1)
    };
    this.agreements.next([...this.agreements.value, newAgr]);
    return of(newAgr);
  }

  // Payments API
  getPayments(): Observable<Payment[]> {
    return this.payments.asObservable();
  }

  processPayment(id: string): Observable<Payment> {
    let processedPay: Payment | null = null;
    const list = this.payments.value.map(p => {
      if (p.id === id) {
        processedPay = { 
          ...p, 
          status: 'Processed' as const, 
          transactionHash: '0x' + Math.random().toString(16).substring(2, 17) 
        };
        return processedPay;
      }
      return p;
    });
    this.payments.next(list);
    return of(processedPay || this.payments.value[0]);
  }

  createPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    const newPay: Payment = {
      ...payment,
      id: 'pay_' + (this.payments.value.length + 1)
    };
    this.payments.next([...this.payments.value, newPay]);
    return of(newPay);
  }

  // Notifications API
  getNotifications(): Observable<AppNotification[]> {
    return this.notifications.asObservable();
  }

  markAllAsRead(): void {
    const list = this.notifications.value.map(n => ({ ...n, isRead: true }));
    this.notifications.next(list);
  }

  markAsRead(id: string): void {
    const list = this.notifications.value.map(n => n.id === id ? { ...n, isRead: true } : n);
    this.notifications.next(list);
  }

  addNotification(notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): void {
    const newNtf: AppNotification = {
      ...notification,
      id: 'ntf_' + (this.notifications.value.length + 1),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    this.notifications.next([newNtf, ...this.notifications.value]);
  }
}
