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
  animate,
  query,
  group
} from '@angular/animations';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('1000ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
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
  }

  ionViewWillLeave() {
    this.showStatus = false;
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
          this.showStatus = true;
          this.isCheckingOut = true;
          setTimeout(() => {
            this.isCheckingOut = false;
          }, 1500)
          this.isCheckedIn = true;
          this.general.presentToast(res.message);
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
          setTimeout(() => {
            this.general.goToRoot('home');
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
