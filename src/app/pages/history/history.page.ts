import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonListHeader, IonNote, IonSearchbar, IonPopover } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CalendarComponentOptions, IonRangeCalendarComponent } from '@googlproxer/ion-range-calendar';

import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonRangeCalendarComponent,
    IonContent, IonButton, IonList, IonItem, IonLabel, IonIcon, IonListHeader, IonNote, IonSearchbar, IonPopover
  ]
})
export class HistoryPage implements OnInit {
  @ViewChild('popover') popover!: HTMLIonPopoverElement;

  http = inject(HttpService);
  general = inject(GeneralService);

  isDatePopoverOpen: boolean = false;
  dateRange: any = { from: new Date(), to: new Date() };
  type: any = 'string'; // 'string' | 'js-date' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };

  user: any;
  searchText = '';


  historyItems: any = [];

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user = GlobaldataService.userObject
    this.getUserHistory()
  }

  openDate(e: any) {
    this.popover.event = e;
    this.isDatePopoverOpen = true
  }

  onChange($event: any) {
    console.log($event);
  }


  getUserHistory() {
    this.http.get('UserHistory', true).subscribe({
      next: async (res: any) => {
        console.log(res)
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
