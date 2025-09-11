import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonListHeader, IonNote, IonSearchbar, IonPopover, IonBackButton } from '@ionic/angular/standalone';
import { CalendarComponentOptions, IonRangeCalendarComponent } from '@googlproxer/ion-range-calendar';

import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonRangeCalendarComponent,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonListHeader, IonNote, IonSearchbar, IonPopover, IonBackButton
  ]
})
export class HistoryPage implements OnInit {
  @ViewChild('popover') popover!: HTMLIonPopoverElement;

  http = inject(HttpService);
  general = inject(GeneralService);
  analytics = inject(AnalyticsService);
  events = inject(EventsService)

  isDatePopoverOpen: boolean = false;
  dateRange: any = { from: new Date(), to: new Date() };
  type: any = 'string'; // 'string' | 'js-date' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  user: any;
  keyword: string = '';


  historyItems: any = [];

  isOpen: boolean = false;
  constructor() {
    this.events.receiveOnPopover().subscribe((res: any) => {
      this.isOpen = res;
    })
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.user = GlobaldataService.userObject;
    this.getUserHistory('', { from: '', to: '' });
    await this.analytics.setCurrentScreen('History')
  }

  searchNow() {
    this.getUserHistory(this.keyword, { from: '', to: '' });
  }

  openDate(e: any) {
    this.popover.event = e;
    this.isDatePopoverOpen = true
  }

  formatDate(date: any) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onStartDate($event: any) {
    this.dateRange.from = this.formatDate(new Date($event.time));
  }

  onEndDate($event: any) {
    this.dateRange.to = this.formatDate(new Date($event.time))
    this.getUserHistory(this.keyword, this.dateRange);
  }


  getUserHistory(keyword: string = '', dates: any) {
    let data = {
      property_name: keyword,
      from: dates.from,
      to: dates.to,
    }
    this.http.post('UserHistory', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading()
        if (res.status == true) {
          this.historyItems = res.data
        }
      },
      error: async (err) => {
        await this.general.stopLoading()

      },
    })
  }

}
