import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  stats = [
    { value: '500+', label: 'PROJECTS COMPLETED' },
    { value: '10k+', label: 'APPLICANTS ENROLLED' },
    { value: '15+', label: 'YEARS OF EXPERIENCE' }
  ];

  features = [
    {
      icon: 'visibility',
      title: 'Real-Time Transparency',
      description: 'Access every detail of your project lifecycle. From legal documentation to financial disbursement, we provide real-time visibility into the redevelopment process.'
    },
    {
      icon: 'gavel',
      title: 'Expert Consultation',
      description: 'Direct access to elite urban planners and legal advisors to ensure your property reaches its maximum potential value.'
    },
    {
      icon: 'gps_fixed',
      title: 'Digital Tracking',
      description: 'Monitor the progress of files, approvals, and construction phase. Stay updated with weekly architectural reports delivered directly to your portal.'
    },
    {
      icon: 'verified_user',
      title: 'Legal Compliance',
      description: 'We handle all RERA, environmental, and municipal clearances. Our dedicated legal wing ensures 100% litigation-free redevelopment for every landowner.'
    }
  ];

  testimonials = [
    {
      quote: 'The level of transparency was unlike anything I’ve seen in the real estate industry. I could track my new home’s progress daily from the portal.',
      author: 'Vikram Malhotra',
      role: 'Primary Shareholder, Malhotra Towers'
    },
    {
      quote: 'From legal clearances to the final handover, Dreams Redevelopment handled everything with absolute precision. Truly a visionary team.',
      author: 'Elena Jones',
      role: 'Redeveloped Owner, Ex-Worli Heights'
    },
    {
      quote: 'The digital tracking feature is brilliant. No more endless meetings—just clear, verified updates every week.',
      author: 'Marcus Thorne',
      role: 'Business Owner, Thorne Commerce'
    }
  ];
}
