import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonCheckbox, IonNote, IonAlert, ModalController, IonModal, IonText, IonIcon, IonButtons, IonInputPasswordToggle } from '@ionic/angular/standalone';

import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { StorageService } from 'src/app/providers/storage.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';

import { ForgetcodeComponent } from 'src/app/components/forgetcode/forgetcode.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonCheckbox, IonNote, IonAlert, IonModal, IonText, IonIcon, IonButtons, IonInputPasswordToggle
  ]
})
export class LoginPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  storage = inject(StorageService);
  formBuilder = inject(FormBuilder);
  analytics = inject(AnalyticsService);
  modalController = inject(ModalController);

  loginForm!: FormGroup;
  isSubmitted: boolean = false;

  isBiometricSaveOpen: boolean = false;
  public alertButtons = [
    {
      text: 'Not Now',
      role: 'cancel',
      handler: () => {
        this.general.goToRoot('home');
      },
    },
    {
      text: 'Yes, Enable',
      role: 'confirm',
      handler: () => {
        this.setCredentials(this.loginForm.value.email_address, this.loginForm.value.password, 'www.cbre.com');
      },
    },
  ];

  forgetPasswordModal: boolean = false;
  forgetPasswordForm!: FormGroup;
  forgetPasswordSubmitted: boolean = false

  constructor() { }

  ngOnInit() {
    this.initForm();
    this.inItForgetPasswordForm();
  }

  async ionViewWilLEnter() {
    await this.analytics.setCurrentScreen('Login');
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      device_token: new FormControl(''),
      email_address: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', Validators.required),
      remember_me: new FormControl(false)
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
    this.loginForm.patchValue({
      device_token: GlobaldataService.deviceToken
    });
    this.loginNow(this.loginForm.value);
  }

  loginNow(data: any) {
    this.http.post2('Login', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          GlobaldataService.loginToken = res.data.user_token;
          await this.storage.setObject('login_token', res.data.user_token);
          await this.analytics.logEvent('login', null);
          if (this.loginForm.value.remember_me) {
            const result = await NativeBiometric.isAvailable({ useFallback: true });
            if (!result.isAvailable) {
              this.general.goToRoot('home');
            } else {
              this.isBiometricSaveOpen = true;
            }
          } else {
            this.general.goToRoot('home');
          }
        } else {
          this.general.presentToast(res.message)
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
        email_address: credentials.username,
        password: credentials.password,
        device_token: GlobaldataService.deviceToken
      })
    } catch (e) {
      this.general.presentAlert('Alert!', 'No account associated, please login to setup!')
    }
  }

  async setCredentials(email: string, password: string, server: string) {
    try {
      await NativeBiometric.deleteCredentials({ server: server });

      await NativeBiometric.setCredentials({
        username: email,
        password: password,
        server: server,
      })

      this.general.goToRoot('home');
    } catch (e) {
      this.saveErrorLog(e);
    }
  }

  saveErrorLog(errData: any) {
    this.http.post2('LoginLogs', { data: errData }, false).subscribe({
      next: (res: any) => {

      },
      error: (err) => {

      },
    })
  }

  deleteCredentials() {
    NativeBiometric.deleteCredentials({
      server: "www.testingexample.com",
    }).then((cres: any) => { });
  }

  inItForgetPasswordForm() {
    this.forgetPasswordForm = this.formBuilder.group({
      email_address: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
    })
  }

  get forgetPasswordControls() {
    return this.forgetPasswordForm.controls;
  }

  onSibmitForgetForm() {
    this.forgetPasswordSubmitted = true;
    if (this.forgetPasswordForm.invalid) {
      this.general.presentToast('Please fill form correctly!');
      return
    }

    this.http.post2('ForgetPassword', this.forgetPasswordForm.value, true).subscribe({
      next: (res: any) => {
        this.general.stopLoading()
        if (res.status == true) {
          this.general.presentToast(res.message);
          this.forgetPasswordModal = false;
          setTimeout(() => {
            this.presentForgetCodeModal()
          }, 250)
        } else {
          this.general.presentToast(res.message);
        }
      },
      error: (err) => {
        this.general.stopLoading()

      },
    })

  }

  async presentForgetCodeModal() {
    const modal = await this.modalController.create({
      component: ForgetcodeComponent,
    });
    return await modal.present();
  }

}
