import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { EventsService } from 'src/app/providers/events.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { StorageService } from 'src/app/providers/storage.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-select-user-type',
  templateUrl: './select-user-type.page.html',
  styleUrls: ['./select-user-type.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon
  ]
})
export class SelectUserTypePage implements OnInit {

  general = inject(GeneralService);
  http = inject(HttpService);
  events = inject(EventsService);
  analytics = inject(AnalyticsService);
  storage = inject(StorageService);
  titleService = inject(Title);

  user: any = null;

  intervalId: any;
  constructor() {
    this.titleService.setTitle('Cocoon | Tablet');
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user = GlobaldataService.userObject;
    this.intervalId = setInterval(() => {
      this.getUserDetails();
    }, 15000)
  }

  ionViewWillLeave() {
    clearInterval(this.intervalId);
  }

  getUserDetails() {
    this.http.get('GetUserDetails', false).subscribe({
      next: (res: any) => {
        if (res.status == true) {
          GlobaldataService.userObject = res.data;
          this.user = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  async logOut() {
    GlobaldataService.clearGobal();
    this.events.publishIsLogout(true);
    await this.storage.clear();
    await this.analytics.logEvent('logout', null);
    setTimeout(() => {
      this.general.goToRoot('web-login');
    }, 50)
  }

}
