import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonCheckbox } from '@ionic/angular/standalone';

import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    IonContent, IonInput, IonButton, IonCheckbox
  ]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async performBiometricVerification() {
    const result = await NativeBiometric.isAvailable({ useFallback: true });
    console.log('result', result);

    if (!result.isAvailable) return;

    const isFaceID = result.biometryType == BiometryType.FACE_ID;

    console.log('isFaceID', isFaceID)

    const verified = await NativeBiometric.verifyIdentity({
      reason: "For easy log in",
      title: "Log in",
      subtitle: "Maybe add subtitle here?",
      description: "Maybe a description too?",
    })
      .then(() => true)
      .catch(() => false);

    console.log('verified', verified)

    if (!verified) return;

    const credentials = await NativeBiometric.getCredentials({
      server: "www.testingexample.com",
    });

    console.log('credentials', credentials);
  }

  setCredentials() {
    NativeBiometric.setCredentials({
      username: "saqib92",
      password: "Password@321",
      server: "www.testingexample.com",
    }).then((cres: any) => {
      console.log('cres', cres)
    });
  }

  deleteCredentials() {
    NativeBiometric.deleteCredentials({
      server: "www.testingexample.com",
    }).then((cres: any) => {
      console.log('cres del', cres)
    });
  }

}
