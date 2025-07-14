import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    IonContent, IonInput, IonButton, IonCheckbox
  ]
})
export class SignupPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
