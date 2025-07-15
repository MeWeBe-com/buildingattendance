import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonNote, IonBadge } from '@ionic/angular/standalone';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton, IonPopover, IonList, IonItem, IonItemDivider, IonLabel, IonNote, IonBadge]
})
export class HeaderComponent implements OnInit {
  @ViewChild('popover') popover!: HTMLIonPopoverElement;


  @Input() selected: string = '';
  isPopoverOpen: boolean = false;


  constructor() { }

  ngOnInit() {
    console.log(this.selected)
  }

  presentPopover(e: Event) {
    console.log(e)
    this.popover.event = e;
    this.isPopoverOpen = true;
  }

}
