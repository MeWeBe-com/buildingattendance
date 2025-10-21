import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  cdr = inject(ChangeDetectorRef);

  user: any;
  selectedProperty: any = undefined;
  properties: any = [];
  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = ''
  alertButtons: any = [];

  userPosition: any = null;
  intervalID: any;
  buildingInterval: any;

  logoTop: number = 400;
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
    if (GlobaldataService.logoTop) {
      this.logoTop = GlobaldataService.logoTop;
    }
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
    }, 20000);
  }

  ionViewWillLeave() {
    clearInterval(this.intervalID);
    clearInterval(this.buildingInterval);
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
    if (e) {
      this.selectedProperty = e;
      this.startBuildingInterval();
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
    } else {
      this.selectedProperty = undefined
      clearInterval(this.buildingInterval)
    }
  }

  checkStatus(canCheckIn: boolean = true) {
    this.http.post('CheckPropertyStatus', { property_id: this.selectedProperty.property_id }, canCheckIn).subscribe({
      next: async (res: any) => {
        if (canCheckIn) {
          await this.general.stopLoading();
        }
        if (res.status == true) {
          this.properties = [];
          setTimeout(() => {
            this.properties = [...res.data.properties];
            const updatedSelectedProperty = this.properties.find((p: any) => p.property_id === this.selectedProperty.property_id);
            if (updatedSelectedProperty) {
              this.selectedProperty = updatedSelectedProperty;
            }
            this.cdr.detectChanges();

            if (this.selectedProperty && this.selectedProperty.status != '0') {
              this.alertHeader = this.selectedProperty.header_message;
              this.alertMessage = this.selectedProperty.message;
              this.alertButtons = ['Dismiss']
              this.isAlertOpen = true;
            }
          }, 250);
        }
      },
      error: async (err) => {
        if (canCheckIn) {
          await this.general.stopLoading();
        }
      },
    })
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
          this.general.presentAlert('Warning!', res.message);
          await this.analytics.logEvent('Check-In Failed', { ...data, user_id: this.user.user_id })
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
        console.log(err)
      },
    })
  }

  startBuildingInterval() {
    this.buildingInterval = setInterval(() => {
      if (!this.user.is_checked_in) {
        this.checkStatus(false);
      }
    }, 60000)
  }

}
