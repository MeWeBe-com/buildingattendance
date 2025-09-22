import { Component, inject, ViewChild } from '@angular/core';
import { IonApp, IonRouterOutlet, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { fingerPrintOutline, addCircleOutline, alertCircle, close, lockOpenOutline, arrowForwardCircle, menuOutline, homeOutline, settingsOutline, locationOutline, logOutOutline, folderOutline, warningOutline, bookOutline, shieldOutline, arrowForwardCircleOutline, calendarOutline, filterOutline, lockClosedOutline, arrowBackCircleOutline, chevronBackOutline, mailOutline, closeOutline, calendarClearOutline, addOutline } from 'ionicons/icons';
import { FcmService } from './providers/fcm.service';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GeneralService } from './providers/general.service';
import { StorageService } from './providers/storage.service';
import { GlobaldataService } from './providers/globaldata.service';
import { AnalyticsService } from './providers/analytics.service';
import { EventsService } from './providers/events.service';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Capacitor } from '@capacitor/core';
import { HttpService } from './providers/http.service';
import { BatteryOptimization } from '@capawesome-team/capacitor-android-battery-optimization';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [LocationAccuracy],
  imports: [CommonModule,
    IonApp, IonRouterOutlet, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonIcon],
})
export class AppComponent {
  @ViewChild('popover') popover!: HTMLIonPopoverElement;

  fcm = inject(FcmService);
  platform = inject(Platform);
  router = inject(Router);
  general = inject(GeneralService)
  storage = inject(StorageService);
  analytics = inject(AnalyticsService);
  events = inject(EventsService);
  locationAccuracy = inject(LocationAccuracy);
  http = inject(HttpService);

  isPopoverOpen: boolean = false;
  selectedPage: any = '';
  isCheckedIn: boolean = false;

  constructor() {
    addIcons({ fingerPrintOutline, addCircleOutline, alertCircle, close, lockOpenOutline, arrowForwardCircle, menuOutline, homeOutline, settingsOutline, locationOutline, logOutOutline, folderOutline, warningOutline, bookOutline, shieldOutline, arrowForwardCircleOutline, calendarOutline, filterOutline, lockClosedOutline, arrowBackCircleOutline, chevronBackOutline, mailOutline, closeOutline, calendarClearOutline, addOutline });
    this.initApp()
  }

  initApp() {
    this.platform.ready().then(async () => {
      this.initializeFirebase();
      this.eventListener();
      this.isGPSEnable();

      if (Capacitor.getPlatform() == 'android') {
        let batteryOptimize = await this.isBatteryOptimizationEnabled();
        if (batteryOptimize) {
          await this.requestIgnoreBatteryOptimization()
        }
      }

      setTimeout(() => {
        this.fcm.getToken();
      }, 1000)
    })
  }

  async initializeFirebase(): Promise<void> {
    if (this.platform.is('capacitor')) {
      return;
    }
    initializeApp(environment.firebaseConfig);
  }

  eventListener() {
    this.events.receivePopover().subscribe((res: any) => {
      this.presentPopover(res);
    })

    this.events.receiveIsCheckedIn().subscribe((res: any) => {
      this.isCheckedIn = res;
    })
  }

  routeCehcker() {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.selectedPage = event.urlAfterRedirects;
    });
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isPopoverOpen = true;
  }

  onClose() {
    this.isPopoverOpen = false;
    this.events.publishOnPopover(false);
  }

  goTo(page: string) {
    this.isPopoverOpen = false;
    setTimeout(() => {
      this.general.goToPage(page);
    }, 50)
  }

  async signOut() {
    this.isPopoverOpen = false;

    this.http.get('Logout', true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          GlobaldataService.clearGobal();
          this.events.publishIsLogout(true);
          await this.storage.clear();
          await this.analytics.logEvent('logout', null);
          setTimeout(() => {
            this.general.goToRoot('login');
          })
        }
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err)
      },
    })



  }

  isGPSEnable() {
    if (Capacitor.isNativePlatform()) {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (succ) => {
              console.log('Request successful')
            },
            (error) => {
              console.log('Error requesting location permissions', error)
            }
          );
        }
      });
    }
  }

  async isBatteryOptimizationEnabled() {
    const { enabled } = await BatteryOptimization.isBatteryOptimizationEnabled();
    return enabled;
  };

  requestIgnoreBatteryOptimization = async () => {
    await BatteryOptimization.requestIgnoreBatteryOptimization();
  };

}
