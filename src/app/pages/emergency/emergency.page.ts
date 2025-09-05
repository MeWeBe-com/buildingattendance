import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { GeneralService } from 'src/app/providers/general.service';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.page.html',
  styleUrls: ['./emergency.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon]
})
export class EmergencyPage implements OnInit {

  general = inject(GeneralService);
  events = inject(EventsService)

  isOpen: boolean = false;

  constructor() { 
    this.events.receiveOnPopover().subscribe((res:any)=>{
      this.isOpen = res;
    })
  }

  ngOnInit() {
  }

}
