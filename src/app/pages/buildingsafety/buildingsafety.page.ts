import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonButton, IonBackButton, IonIcon} from '@ionic/angular/standalone';
import { GeneralService } from 'src/app/providers/general.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-buildingsafety',
  templateUrl: './buildingsafety.page.html',
  styleUrls: ['./buildingsafety.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonHeader, IonTitle, IonToolbar, IonButtons, IonContent, IonButton, IonBackButton, IonIcon
  ]
})
export class BuildingsafetyPage implements OnInit {

  general = inject(GeneralService);
  analytics = inject(AnalyticsService);
  events = inject(EventsService)

  isOpen: boolean = false;

  constructor() {
    this.events.receiveOnPopover().subscribe((res: any) => {
      this.isOpen = res;
    })
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.analytics.setCurrentScreen('Building Safety');
  }

}
