import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-select-user-type',
  templateUrl: './select-user-type.page.html',
  styleUrls: ['./select-user-type.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon
  ]
})
export class SelectUserTypePage implements OnInit {

  selectedProperty: any = {
    building_name: 'CROYDON DATA CENTRE',
    status: '0'
  }

  selected_type: string = '';
  constructor() { }

  ngOnInit() {
  }

}
