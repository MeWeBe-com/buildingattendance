import { Component } from '@angular/core';
import { IonContent, IonToggle, IonIcon, IonCheckbox } from '@ionic/angular/standalone';
import { Radar } from 'capacitor-radar';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonToggle, IonIcon, IonCheckbox],
})
export class HomePage {

  constructor() { }

  ionViewDidEnter() {
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
