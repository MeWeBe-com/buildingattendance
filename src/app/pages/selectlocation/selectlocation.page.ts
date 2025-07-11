import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption } from '@ionic/angular/standalone';

@Component({
  selector: 'app-selectlocation',
  templateUrl: './selectlocation.page.html',
  styleUrls: ['./selectlocation.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption
  ]
})
export class SelectlocationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
