import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonAlert } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { Geolocation } from '@capacitor/geolocation'
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { Capacitor } from '@capacitor/core';

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

  general = inject(GeneralService)
  http = inject(HttpService);

  user: any;
  selectedProperty: any = undefined;
  properties: any = [];
  isAlertOpen: boolean = false;
  alertHeader: string = '';
  alertMessage: string = ''
  alertButtons: any = [];

  userPosition: any = null;

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user = GlobaldataService.userObject;
    this.getProperties();
  }

  ionViewDidEnter() {
    if(Capacitor.isNativePlatform()){
      this.getLocation()
    }
  }

  async getLocation() {
    try {
      let per = await Geolocation.requestPermissions();
      if (per.location == 'granted') {
        let position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        console.log(position)
        if (position) {
          this.userPosition = position;
        }
      }
    } catch (e) {
      console.log(e)
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

  changeLocation(e: any) {
    this.selectedProperty = e;

    if (this.selectedProperty.status != '0') {
      if (this.selectedProperty.status == '1') {
        this.alertHeader = 'Emergency – Do Not Enter';
        this.alertMessage = 'Contact Security for Assistance';
        this.alertButtons = ['Dismiss']
      } else {
        this.alertHeader = 'Status: Temporarily Closed';
        this.alertMessage = 'Tap below for more information';
        this.alertButtons = [
          {
            text: 'Building Info',
            role: 'confirm',
            handler: () => {
              console.log('Info confirmed');
            },
          },
        ]
      }
      this.isAlertOpen = true;
    }
  }

  checkIn() {
    let data = {
      property_id: this.selectedProperty.property_id,
      lat: this.userPosition.coords.latitude,
      lng: this.userPosition.coords.longitude
    }
    this.http.post('CheckIn', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.general.presentToast(res.message);
          this.general.goToRoot('checkout');
        } else {
          this.general.presentToast(res.message)
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
        console.log(err)
      },
    })

  }

}
