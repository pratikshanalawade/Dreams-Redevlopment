import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Property } from '../../interfaces/property.interface';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-property',
  standalone: true,
  imports: [CommonModule, RouterLink, MatProgressBarModule],
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  propertiesList: Property[] = [];
  selectedProperty: Property | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getProperties().subscribe(properties => {
      this.propertiesList = properties;
      if (this.propertiesList.length > 0) {
        this.selectedProperty = this.propertiesList[0];
      }
    });
  }

  selectProperty(p: Property): void {
    this.selectedProperty = p;
  }
}
