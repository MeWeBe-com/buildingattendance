import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-selectuser',
  templateUrl: './selectuser.page.html',
  styleUrls: ['./selectuser.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon
  ] 
})
export class SelectuserPage implements OnInit {

  selectedProperty: any = {
    building_name: 'CROYDON DATA CENTRE',
    status: '0'
  }

  selected_type: string = '';
  constructor() { }

  ngOnInit() {
  }

}
