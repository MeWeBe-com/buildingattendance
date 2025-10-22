import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';

import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-selectuser',
  templateUrl: './selectuser.page.html',
  styleUrls: ['./selectuser.page.scss'],
  standalone: true,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(100%)',
          position: 'absolute',
          width: '100%'
        }),
        animate(
          '1000ms 200ms cubic-bezier(0.25, 1, 0.5, 1)', // ✅ correct order: duration delay easing
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      ]),
      transition(':leave', [
        style({ position: 'absolute', width: '100%' }),
        animate(
          '800ms cubic-bezier(0.25, 1, 0.5, 1)',
          style({ opacity: 0, transform: 'translateX(-100%)' })
        )
      ])
    ])
  ],
  imports: [CommonModule, FormsModule, NgSelectComponent, NgOptionComponent,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonIcon
  ]
})
export class SelectuserPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  analytics = inject(AnalyticsService);
  titleService = inject(Title);

  user: any = null;

  users: any = [];
  selected_user: any = null;

  isCheckingOut: boolean = false;

  intervalId: any;
  constructor() {
    this.titleService.setTitle('Cocoon | Tablet');
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.user = GlobaldataService.userObject;
    this.getUsers();
    this.intervalId = setInterval(() => {
      this.getUserDetails();
    }, 15000)
    await this.analytics.setCurrentScreen('Web-User-Checkin');
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

  getUsers() {
    this.http.get(`GetCompanyUsers/${GlobaldataService.userObject.property_id}`, false).subscribe({
      next: (res: any) => {
        this.users = res.data.users;
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  onUserSelect(e: any) {
    this.selected_user = e;
  }

  updateStatus(user: any) {
    let data = {
      user_id: user.user_id,
      property_id: this.user.property_id
    }
    if (user.is_check_in) {
      this.checkOut(data);
    } else {
      this.checkIn(data);
    }
  }

  checkIn(data: any) {
    this.http.post('CheckIn', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.selected_user.is_check_in = true;
          this.general.presentToast(res.message);
          //this.general.goToPage('select-user-type')
        } else {
          this.general.presentToast(res.message)
        }
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err)
      },
    })
  }

  checkOut(data: any) {
    this.http.post('CheckOut', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.selected_user.is_check_in = false;
          this.general.presentToast(res.message);
          //this.general.goToPage('select-user-type')
        } else {
          this.general.presentToast(res.message)
        }
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err)
      },
    })
  }

}