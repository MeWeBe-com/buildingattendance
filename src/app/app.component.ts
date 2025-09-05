import { Component, inject, ViewChild } from '@angular/core';
import { IonApp, IonRouterOutlet, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonNote, IonBadge, IonIcon } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { fingerPrintOutline, addCircleOutline, alertCircle, close, lockOpenOutline, arrowForwardCircle, menuOutline, homeOutline, settingsOutline, locationOutline, logOutOutline, folderOutline, warningOutline, bookOutline, shieldOutline, arrowForwardCircleOutline, calendarOutline, filterOutline, lockClosedOutline, arrowBackCircleOutline, chevronBackOutline, mailOutline, closeOutline } from 'ionicons/icons';
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [CommonModule,
    IonApp, IonRouterOutlet, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonNote, IonBadge, IonIcon],
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

  isPopoverOpen: boolean = false;
  selectedPage: any = '';

  constructor() {
    addIcons({ fingerPrintOutline, addCircleOutline, alertCircle, close, lockOpenOutline, arrowForwardCircle, menuOutline, homeOutline, settingsOutline, locationOutline, logOutOutline, folderOutline, warningOutline, bookOutline, shieldOutline, arrowForwardCircleOutline, calendarOutline, filterOutline, lockClosedOutline, arrowBackCircleOutline, chevronBackOutline, mailOutline, closeOutline });
    this.initApp()
  }

  initApp() {
    this.platform.ready().then(async () => {
      this.initializeFirebase();
      this.eventListener();
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
  }

  routeCehcker() {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      console.log(event)
      this.selectedPage = event.urlAfterRedirects;
    });
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isPopoverOpen = true;
  }

  onClose(){
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
    GlobaldataService.clearGobal();
    await this.storage.clear();
    await this.analytics.logEvent('logout', null);
    setTimeout(() => {
      this.general.goToRoot('login');
    }, 50)
  }

}
