import { Component } from '@angular/core';
import { IonContent, IonToggle, IonText, IonIcon, IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonToggle, IonText, IonIcon, IonCheckbox],
})
export class HomePage {
  constructor() { }



}
