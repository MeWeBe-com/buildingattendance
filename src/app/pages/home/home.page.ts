import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonToggle, IonIcon, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

import { GlobaldataService } from 'src/app/providers/globaldata.service';

import { Radar } from 'capacitor-radar';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { StorageService } from 'src/app/providers/storage.service';
import { EventsService } from 'src/app/providers/events.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, FormsModule, RouterLink,
    IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonToggle, IonIcon, IonCheckbox, IonButton],
})
export class HomePage {
  general = inject(GeneralService);
  http = inject(HttpService);
  storage = inject(StorageService);
  analytics = inject(AnalyticsService);
  events = inject(EventsService);


  showAutoChekin: boolean = true;
  user: any = {
    auto_checkin: false
  };
  isOpen: boolean = false;

  constructor() {
    this.events.receiveOnPopover().subscribe((res: any) => {
      this.isOpen = res;
    })
  }

  async ionViewDidEnter() {
    this.user = GlobaldataService.userObject;
    await this.analytics.setCurrentScreen('Home');
    this.setupRadar(this.user.user_id);
  }

  setupRadar(id: any) {
    Radar.setUserId({ userId: (id).toString() });
    Radar.requestLocationPermissions({ background: true });

    Radar.getLocationPermissionsStatus().then((result) => {
      if (result.status === 'DENIED') {
        Radar.requestLocationPermissions({ background: true });
      } else {
        this.startTracking();
      }
    });
  }

  startTracking() {
    //Radar.startTrackingContinuous(); // start
    let opt: any = null;
    if (Capacitor.getPlatform() == 'ios') {
      opt = {
        desiredStoppedUpdateInterval: 30,
        desiredMovingUpdateInterval: 30,
        desiredSyncInterval: 10,
        desiredAccuracy: 'high',
        stopDuration: 140,
        stopDistance: 30,
        startTrackingAfter: null,
        stopTrackingAfter: null,
        replay: "all",
        syncLocations: "all",
        showBlueBar: true,
        useStoppedGeofence: false,
        stoppedGeofenceRadius: 0,
        useMovingGeofence: false,
        movingGeofenceRadius: 0,
        syncGeofences: false,
        useVisits: true,
        useSignificantLocationChanges: false,
        beacons: false
      };
    } else {
      opt = {
        desiredStoppedUpdateInterval: 30,
        fastestStoppedUpdateInterval: 30,
        desiredMovingUpdateInterval: 30,
        fastestMovingUpdateInterval: 15,
        desiredSyncInterval: 10,
        desiredAccuracy: 'high',
        stopDuration: 140,
        stopDistance: 30,
        startTrackingAfter: null,
        stopTrackingAfter: null,
        replay: 'all',
        sync: 'all',
        useStoppedGeofence: false,
        stoppedGeofenceRadius: 0,
        useMovingGeofence: false,
        movingGeofenceRadius: 0,
        syncGeofences: false,
        syncGeofencesLimit: 0,
        foregroundServiceEnabled: true,
        beacons: false
      };
    }
    Radar.startTrackingCustom({
      options: opt
    });

    // Radar.setForegroundServiceOptions({
    //   options: {
    //     text: "Text",
    //     title: "Title",
    //     iconString: 'your_icon_name',
    //     updatesOnly: false,
    //   }
    // })
  }

  onChange(e: any) {
    this.http.post('UpdateCheckInStatus', { auto_checkin: e.detail.checked }, true).subscribe({
      next: async (res: any) => {
        GlobaldataService.userObject.auto_checkin = res.data.auto_checkin;
        await this.storage.setObject('CBREuserObject', GlobaldataService.userObject);
        await this.general.stopLoading();
        await this.general.presentToast(res.message);
        await this.analytics.logEvent('auto_check_in', { status: res.data.auto_checkin, user_id: this.user.user_id });
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err);
      },
    })
  }

}