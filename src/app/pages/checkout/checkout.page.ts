import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventsService } from 'src/app/providers/events.service';

import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
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
  imports: [CommonModule, FormsModule,
    IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonIcon, IonButton
  ]
})
export class CheckoutPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  analytics = inject(AnalyticsService);
  events = inject(EventsService);

  user: any;
  isCheckedIn: boolean = false;
  isCheckingOut: boolean = false;
  showCheckInArrow: boolean = true;
  showIconAnimation: boolean = false;
  building: any = null;
  showStatus: boolean = false;

  isOpen: boolean = false;
  intervalID: any;

  constructor() {
    this.events.receiveOnPopover().subscribe((res: any) => {
      this.isOpen = res;
    })
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (GlobaldataService.selectedProperty) {
      this.building = GlobaldataService.selectedProperty.building;
    }
    this.user = GlobaldataService.userObject;
    this.isCheckedIn = this.user.is_checked_in;
    this.showStatus = this.user.is_checked_in;
    this.showCheckInArrow = true;
  }

  async ionViewDidEnter() {
    await this.analytics.setCurrentScreen('Checkout Page');
    if (GlobaldataService.userObject.is_checked_in) {
      this.intervalID = setInterval(() => {
        this.getUserDetails();
      }, 15000);
    }
  }

  ionViewWillLeave() {
    this.showStatus = false;
    clearInterval(this.intervalID);
  }

  getUserDetails() {
    this.http.get('GetUserDetails', false).subscribe({
      next: (res: any) => {
        if (res.status == true) {
          if (res.data.is_checked_in) {
            this.user = res.data;
          } else {
            this.general.goToRoot('home');
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  checkIn() {
    if (!GlobaldataService.selectedProperty) {
      this.general.goBack();
      return;
    }
    let data = GlobaldataService.selectedProperty;

    this.http.post('CheckIn', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.user.property_name = res.property_name;
          this.showStatus = true;
          this.isCheckingOut = true;
          setTimeout(() => {
            this.isCheckingOut = false;
          }, 1500)
          this.isCheckedIn = true;
          this.general.presentToast(res.message);
          this.events.publishIsCheckedIn(true);
          await this.analytics.logEvent('Check-In', { ...data, user_id: this.user.user_id })
        } else {
          this.general.presentAlert('Warning!', 'You can only check in when are at the location!');
          await this.analytics.logEvent('Check-In Failed', { ...data, user_id: this.user.user_id })
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
        console.log(err)
      },
    })
  }

  checkOut() {
    if (this.showCheckInArrow == false) {
      this.general.goToRoot('home');
      return
    }
    this.http.get('CheckOut', true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.showStatus = true;
          this.showIconAnimation = true;
          setTimeout(() => {
            this.showIconAnimation = false;
          }, 500)
          this.isCheckedIn = false;
          this.isCheckingOut = true;
          this.showCheckInArrow = false;
          await this.analytics.logEvent('Check-Out', { user_id: this.user.user_id })
          this.general.presentToast(res.message);
          this.events.publishIsCheckedIn(false);
          setTimeout(() => {
            this.general.goToRoot('selectlocation');
          }, 3000)
        } else {
          this.general.presentToast(res.message)
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
      },
    })
  }

  onChange(e: any) {
    this.http.post('CheckOutManual', { property_id: this.user.property_id }, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        await this.analytics.logEvent('manual_check_out', { user_id: this.user.user_id, propert_id: this.user.propert_id });
        await this.general.presentToast(res.message);
        this.general.goToRoot('home');
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err);
      },
    })
  }

}
