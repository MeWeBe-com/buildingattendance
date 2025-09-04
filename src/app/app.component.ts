import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { fingerPrintOutline, addCircleOutline, alertCircle, close, lockOpenOutline, arrowForwardCircle, menuOutline, homeOutline, settingsOutline, locationOutline, logOutOutline, folderOutline, warningOutline, bookOutline, shieldOutline, arrowForwardCircleOutline, calendarOutline, filterOutline, lockClosedOutline, arrowBackCircleOutline, chevronBackOutline, mailOutline } from 'ionicons/icons';
import { FcmService } from './providers/fcm.service';
import { Capacitor } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  fcm = inject(FcmService);
  platform = inject(Platform);

  constructor() {
    addIcons({ fingerPrintOutline, addCircleOutline, alertCircle, close, lockOpenOutline, arrowForwardCircle, menuOutline, homeOutline, settingsOutline, locationOutline, logOutOutline, folderOutline, warningOutline, bookOutline, shieldOutline, arrowForwardCircleOutline, calendarOutline, filterOutline, lockClosedOutline, arrowBackCircleOutline, chevronBackOutline, mailOutline });
    this.initApp()
  }

  initApp() {
    this.platform.ready().then(async () => {
      this.initializeFirebase();
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
}
