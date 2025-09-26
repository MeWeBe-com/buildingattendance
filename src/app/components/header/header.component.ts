import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton } from '@ionic/angular/standalone';

import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule,
    IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton
  ]
})
export class HeaderComponent implements OnInit {

  general = inject(GeneralService);
  events  = inject(EventsService)

  @Input() title: string = '';
  @Input() selected: any = undefined;
  user: any;

  isOpen: boolean = false;

  constructor() { 
    this.events.receiveOnPopover().subscribe((res:any)=>{
      this.isOpen = res;
    })
  }

  ngOnInit() {
    this.user = GlobaldataService.userObject;
  }

}
