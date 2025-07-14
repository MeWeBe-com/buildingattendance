import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-selectlocation',
  templateUrl: './selectlocation.page.html',
  styleUrls: ['./selectlocation.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectComponent, NgOptionComponent,
    IonContent, IonHeader, IonTitle, IonToolbar, IonIcon
  ]
})
export class SelectlocationPage implements OnInit {

  selectedCar: any;

  cars = [
    { id: 1, name: 'Volvo', status: 'red' },
    { id: 2, name: 'Saab', status: 'green' },
    { id: 3, name: 'Opel', status: 'orange' },
  ];

  constructor() { }

  ngOnInit() {
  }

  changeLocation(e: any) {
    console.log(e)
  }

}
