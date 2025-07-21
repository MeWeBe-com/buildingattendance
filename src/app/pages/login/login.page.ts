import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonCheckbox, IonNote } from '@ionic/angular/standalone';

import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { StorageService } from 'src/app/providers/storage.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
    IonContent, IonInput, IonButton, IonCheckbox, IonNote
  ]
})
export class LoginPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  storage = inject(StorageService);
  formBuilder = inject(FormBuilder);

  loginForm!: FormGroup;
  isSubmitted: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      decive_token: new FormControl(''),
      email: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', Validators.required)
    })
  }

  get getControl() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      this.general.presentToast('Please fill form correctly!')
      return
    }

    console.log(this.loginForm.value);

    this.http.post2('auth.php?action=login', this.loginForm.value, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        console.log(res);
        if (res.status) {
          GlobaldataService.userObject = res.user;
          await this.storage.setObject('CBREUser', res.user);
          setTimeout(() => {
            this.general.goToPage('home');
          })
        } else {
          this.general.presentToast(res.error)
        }
      },
      error: async (err: any) => {
        await this.general.stopLoading();
      },
    })

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
