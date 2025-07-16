import { Component } from '@angular/core';
import { IonContent, IonToggle, IonIcon, IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, IonToggle, IonIcon, IonCheckbox],
})
export class HomePage {
  constructor() { }



}
