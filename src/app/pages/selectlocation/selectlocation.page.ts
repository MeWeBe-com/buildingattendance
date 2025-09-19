import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonAlert } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';

import { Geolocation } from '@capacitor/geolocation';
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { Capacitor } from '@capacitor/core';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { Keyboard, KeyboardResize, KeyboardResizeOptions } from '@capacitor/keyboard';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-selectlocation',
  templateUrl: './selectlocation.page.html',
  styleUrls: ['./selectlocation.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectComponent, NgOptionComponent, HeaderComponent,
    IonContent, IonIcon, IonAlert
  ]
})
export class SelectlocationPage implements OnInit {

  general = inject(GeneralService);
  http = inject(HttpService);
  analytics = inject(AnalyticsService);
  events = inject(EventsService);

  user: any;
  selectedProperty: any = undefined;
  properties: any = [];
  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = ''
  alertButtons: any = [];

  userPosition: any = null;
  intervalID: any;
  constructor() { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (Capacitor.getPlatform() == 'ios') {
      let opt: KeyboardResizeOptions = {
        mode: KeyboardResize.None
      }
      await Keyboard.setResizeMode(opt);
    }

    this.user = GlobaldataService.userObject;
    this.getProperties();
  }

  async ionViewDidEnter() {
    await this.analytics.setCurrentScreen('Select Location')
    if (Capacitor.isNativePlatform()) {
      await this.getLocation()
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((succ) => {
          this.userPosition = {
            coords: {
              latitude: succ.coords.latitude,
              longitude: succ.coords.longitude
            }
          }
        }, (err) => {
          console.log(err)
        });
      }
    }
    this.intervalID = setInterval(() => {
      this.getUserDetails();
    }, 30000);
  }


  ionViewWillLeave() {
    clearInterval(this.intervalID);
  }

  getUserDetails() {
    this.http.get('GetUserDetails', false).subscribe({
      next: (res: any) => {
        if (res.status == true) {
          if (res.data.is_checked_in) {
            this.general.goToRoot('checkout');
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  async getLocation() {
    try {
      let per = await Geolocation.requestPermissions();
      if (per.location == 'granted') {
        let position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        if (position) {
          this.userPosition = position;
        }
      }
    } catch (e) {
      console.log(e);
      this.general.presentAlert('Alert!', 'Please enable device location service (GPS).')
    }

  }

  getProperties() {
    this.http.get('GetPropertiesByCompanyID', true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading()
        if (res.status == true) {
          this.properties = res.data;
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
        console.log(err)
      }
    })
  }

  async changeLocation(e: any) {
    this.selectedProperty = e;
    await this.analytics.logEvent('Selected Location', e)

    if (this.selectedProperty && this.selectedProperty.status != '0') {
      this.alertHeader = this.selectedProperty.header_message;
      this.alertMessage = this.selectedProperty.message;
      this.alertButtons = ['Dismiss']
      this.isAlertOpen = true;
    }

    setTimeout(() => {
      if (Capacitor.isNativePlatform()) {
        Keyboard.hide();
      }
    }, 100)
  }

  checkIn() {
    let data = {
      building: this.selectedProperty,
      property_id: this.selectedProperty.property_id,
      lat: this.userPosition.coords.latitude,
      lng: this.userPosition.coords.longitude
    }

    this.http.post('CheckIn', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          GlobaldataService.userObject.property_name = res.property_name;
          this.general.presentToast(res.message);
          this.events.publishIsCheckedIn(true);
          await this.analytics.logEvent('Check-In', { ...data, user_id: this.user.user_id })
          this.general.goToPage('checkout');
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

  // onChange(e: any) {
  //   this.http.post('CheckIn', { property_id: this.selectedProperty.property_id }, true).subscribe({
  //     next: async (res: any) => {
  //       await this.general.stopLoading();
  //       await this.general.presentToast(res.message);
  //       await this.analytics.logEvent('manual_check_in', { user_id: this.user.user_id, propert_id: this.selectedProperty.propert_id });
  //       this.general.goToRoot('checkout');
  //     },
  //     error: async (err) => {
  //       await this.general.stopLoading();
  //       console.log(err);
  //     },
  //   })
  // }

}
