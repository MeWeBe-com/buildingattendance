import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonToggle, IonIcon, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

import { GlobaldataService } from 'src/app/providers/globaldata.service';

import { Radar } from 'capacitor-radar';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, RouterLink, IonContent, IonToggle, IonIcon, IonCheckbox, IonButton],
})
export class HomePage {

  user: any;

  constructor() { }

  ionViewDidEnter() {
    this.user = GlobaldataService.userObject;
    Radar.setUserId({ userId: 'test123' });

    Radar.addListener('clientLocation', (result) => {
      // do something with result.location, result.stopped, result.source
      console.log('clientLocation', result)
    });

    Radar.addListener('location', (result) => {
      // do something with result.location, result.user
      console.log('location', result)
    });

    Radar.addListener('events', (result) => {
      // do something with result.events, result.user
      console.log('events', result)
    });

    Radar.getLocationPermissionsStatus().then((result) => {
      // do something with result.status
      console.log(result)
      if (result.status === 'DENIED') {
        Radar.requestLocationPermissions({ background: true });
      } else {
        this.startTracking();
      }
    });

  }

  startTracking() {
    Radar.startTrackingContinuous(); // start
  }

}
