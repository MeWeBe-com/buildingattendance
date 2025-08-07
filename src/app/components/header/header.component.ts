import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonNote, IonBadge } from '@ionic/angular/standalone';

import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { StorageService } from 'src/app/providers/storage.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';

import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule,
    IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonNote, IonBadge
  ]
})
export class HeaderComponent implements OnInit {
  @ViewChild('popover') popover!: HTMLIonPopoverElement;

  router = inject(Router);
  general = inject(GeneralService);
  storage = inject(StorageService);
  analytics = inject(AnalyticsService);

  selectedPage: any = '';

  @Input() title: string = '';
  @Input() selected: any = undefined;
  @Input() showMenu: boolean = false;
  isPopoverOpen: boolean = false;
  user: any;

  constructor() { }

  ngOnInit() {
    this.user = GlobaldataService.userObject;
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.selectedPage = event.urlAfterRedirects;
    });
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isPopoverOpen = true;
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
