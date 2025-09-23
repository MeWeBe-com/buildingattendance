import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonButton, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { GeneralService } from 'src/app/providers/general.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventsService } from 'src/app/providers/events.service';
import { PreviousRouteService } from 'src/app/providers/previous-route.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonButton, IonBackButton, IonIcon
  ]
})
export class TermsPage implements OnInit {

  general = inject(GeneralService);
  analytics = inject(AnalyticsService);
  events = inject(EventsService);
  previousRouteService = inject(PreviousRouteService);

  isOpen: boolean = false;
  previousRoute: any = '';

  constructor() {
    this.events.receiveOnPopover().subscribe((res: any) => {
      this.isOpen = res;
    })
  }

  ngOnInit() {
    if (this.previousRouteService.getPreviousUrl()) {
      this.previousRoute = this.previousRouteService.getPreviousUrl();
    }
  }

  async ionViewWillEnter() {
    await this.analytics.setCurrentScreen('Terms & Conditions');
  }

}
