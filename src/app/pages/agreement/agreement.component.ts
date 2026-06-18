import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Agreement } from '../../interfaces/agreement.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-agreement',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {
  agreementsList: Agreement[] = [];
  currentUserFullName = '';

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.currentUserFullName = user.fullName;
      this.dataService.getAgreements().subscribe(agreements => {
        this.agreementsList = agreements.filter(a => 
          a.parties.some(p => p.includes(user.fullName)) || user.role === 'admin'
        );
      });
    }
  }

  signAgreement(id: string): void {
    this.dataService.signAgreement(id).subscribe(() => {
      // Data service automatically triggers updates
    });
  }

  downloadMockPdf(fileName: string): void {
    alert(`Downloading ${fileName}... (Simulation of file fetch success)`);
  }
}
