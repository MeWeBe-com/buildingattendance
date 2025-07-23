import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonListHeader, IonNote, IonSearchbar } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent,
    IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonListHeader, IonNote, IonSearchbar
  ]
})
export class HistoryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  searchText = '';
  selectedDateRange = 'Jan 6, 2025 – Jan 13, 2025';

  historyItems = [
    {
      location: 'Croydon Data Centre',
      date: '6 Jan, 2025',
      startTime: '09:00',
      endTime: '16:00',
    },
    {
      location: 'Heathrow Data Centre',
      date: '9 Jan, 2025',
      startTime: '1100',
      endTime: '2000',
    },
    {
      location: 'Northgate Exchange',
      date: '9 Jan, 2025',
      startTime: '900',
      endTime: '1600',
    },
    {
      location: 'Heathrow Data Centre',
      date: '9 Jan, 2025',
      startTime: '800',
      endTime: '1700',
    },
    {
      location: 'Northgate Exchange',
      date: '10 Jan, 2025',
      startTime: '900',
      endTime: '1730',
    },
    {
      location: 'Croydon Data Centre',
      date: '12 Jan, 2025',
      startTime: '900',
      endTime: '1600',
    },
    {
      location: 'Heathrow Data Centre',
      date: '13 Jan, 2025',
      startTime: '900',
      endTime: '1600',
    },
    {
      location: 'Croydon Data Centre',
      date: '13 Jan, 2025',
      startTime: '900',
      endTime: '1600',
    },
  ];

}
