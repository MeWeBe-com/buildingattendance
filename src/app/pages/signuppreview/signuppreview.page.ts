import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signuppreview',
  templateUrl: './signuppreview.page.html',
  styleUrls: ['./signuppreview.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonButtons, IonBackButton
  ]
})
export class SignuppreviewPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
