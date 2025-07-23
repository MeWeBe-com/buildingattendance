import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonNote, IonBadge } from '@ionic/angular/standalone';

import { GeneralService } from 'src/app/providers/general.service';

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

  general = inject(GeneralService);


  @Input() title: string = 'Select Location';
  @Input() selected: any = null;
  @Input() showMenu: boolean = false;
  isPopoverOpen: boolean = false;


  constructor() { }

  ngOnInit() { }

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

}
