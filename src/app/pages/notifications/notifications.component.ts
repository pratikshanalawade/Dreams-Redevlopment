import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { AppNotification } from '../../interfaces/notification.interface';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notificationsList: AppNotification[] = [];
  currentUserRole = '';

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.currentUserRole = user.role;
      this.dataService.getNotifications().subscribe(notifications => {
        this.notificationsList = notifications.filter(n => 
          n.role === 'all' || n.role === user.role
        );
      });
    }
  }

  markAsRead(id: string): void {
    this.dataService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.dataService.markAllAsRead();
  }
}
