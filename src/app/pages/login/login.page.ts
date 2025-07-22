import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonCheckbox, IonNote, IonAlert } from '@ionic/angular/standalone';

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
    IonContent, IonInput, IonButton, IonCheckbox, IonNote, IonAlert
  ]
})
export class LoginPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  storage = inject(StorageService);
  formBuilder = inject(FormBuilder);

  loginForm!: FormGroup;
  isSubmitted: boolean = false;

  isBiometricSaveOpen: boolean = false;
  public alertButtons = [
    {
      text: 'Not Now',
      role: 'cancel',
      handler: () => {
        this.general.goToPage('home');
      },
    },
    {
      text: 'Yes, Enable',
      role: 'confirm',
      handler: () => {
        this.setCredentials(this.loginForm.value.email, this.loginForm.value.password, 'www.cbre.com');
      },
    },
  ];

  constructor() { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      decive_token: new FormControl(''),
      email_address: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
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

    this.loginNow(this.loginForm.value);
  }

  loginNow(data: any) {
    this.http.post2('Login', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          GlobaldataService.userObject = res.data.user_token;
          await this.storage.setObject('login_token', res.data.user_token);

          const result = await NativeBiometric.isAvailable({ useFallback: true });
          if (!result.isAvailable) {
            this.general.goToPage('home');
          } else {
            try {
              const isCredentialSaved = await NativeBiometric.getCredentials({
                server: "www.cbre.com",
              });
              this.general.goToPage('home');
            } catch (e) {
              this.isBiometricSaveOpen = true;
              console.log(e)
            }
          }
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
    if (!result.isAvailable) return;
    const isFaceID = result.biometryType == BiometryType.FACE_ID;

    const verified = await NativeBiometric.verifyIdentity({
      reason: "Authenticate to access your account quickly and securely",
      title: "Biometric Login",
      subtitle: "Use your fingerprint or face recognition",
      description: "Your biometric data will be used to confirm your identity",
      //allowedBiometryTypes:[BiometryType.FACE_ID, BiometryType.FACE_AUTHENTICATION, BiometryType.FINGERPRINT]
    }).then(() => true).catch(() => false);

    if (!verified) return;

    try {
      const credentials = await NativeBiometric.getCredentials({
        server: "www.cbre.com",
      });
      this.loginNow({
        email: credentials.username,
        password: credentials.password
      })
    } catch (e) {
      console.log(e)
    }
  }

  setCredentials(email: string, password: string, server: string) {
    NativeBiometric.setCredentials({
      username: email,
      password: password,
      server: server,
    }).then((cres: any) => {
      this.general.goToPage('home');
    });
  }

  deleteCredentials() {
    NativeBiometric.deleteCredentials({
      server: "www.testingexample.com",
    }).then((cres: any) => { });
  }

}
