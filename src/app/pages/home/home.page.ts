import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonToggle, IonText, IonIcon, IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonToggle, IonText, IonIcon, IonCheckbox],
})
export class HomePage {
  constructor() { }



}
