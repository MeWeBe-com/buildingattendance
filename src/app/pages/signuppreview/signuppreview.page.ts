import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonButtons, IonBackButton, IonNote } from '@ionic/angular/standalone';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { StorageService } from 'src/app/providers/storage.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';

@Component({
  selector: 'app-signuppreview',
  templateUrl: './signuppreview.page.html',
  styleUrls: ['./signuppreview.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonButton, IonButtons, IonBackButton, IonNote
  ]
})
export class SignuppreviewPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  storage = inject(StorageService);
  formBuilder = inject(FormBuilder);
  analytics = inject(AnalyticsService);


  profile: any;

  passwordForm!: FormGroup;
  isSubmitted: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initForm()
  }

  async ionViewWillEnter() {
    this.profile = GlobaldataService.signupData;
    await this.analytics.setCurrentScreen('SignUp Preview')
  }

  initForm() {
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$%^&*]/),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$%^&*]/),
      ])
    })
  }

  get getControl() {
    return this.passwordForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.passwordForm.invalid || (this.getControl['password'].value != this.getControl['confirm_password'].value)) {
      this.general.presentToast('Please fill form correctly!')
      return
    }

    let data = {
      ...this.profile,
      ...this.passwordForm.value
    };

    this.http.post2('RegisterUser', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          await this.analytics.logEvent('Signup', data)
          this.general.presentToast(res.message);
          this.general.goToPage('login')
        } else {
          this.general.presentToast(res.message);
          await this.analytics.logEvent('Signup Failed', res)
        }
      },
      error: async (err) => {
        await this.general.stopLoading();
      },
    })
  }

}
