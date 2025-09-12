import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-selectuser',
  templateUrl: './selectuser.page.html',
  styleUrls: ['./selectuser.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon,  IonSelect, IonSelectOption
  ] 
})
export class SelectuserPage implements OnInit {

  selectedProperty: any = {
    building_name: 'CROYDON DATA CENTRE',
    status: '0'
  }

  selected_user: any = null;
  constructor() { }

  ngOnInit() {
  }

}
