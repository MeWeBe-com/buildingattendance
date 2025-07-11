import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonCheckbox, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonInput, IonButton, IonCheckbox, IonIcon
  ]
})
export class SignupPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
