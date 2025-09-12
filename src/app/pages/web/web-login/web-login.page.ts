import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonNote, } from '@ionic/angular/standalone';

import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { StorageService } from 'src/app/providers/storage.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';


@Component({
  selector: 'app-web-login',
  templateUrl: './web-login.page.html',
  styleUrls: ['./web-login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    IonContent, IonInput, IonButton, IonNote
  ]
})
export class WebLoginPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  storage = inject(StorageService);
  formBuilder = inject(FormBuilder);
  analytics = inject(AnalyticsService);

  loginForm!: FormGroup;
  isSubmitted: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initForm();
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
    this.general.goToPage('selectuser');
    return
    this.http.post2('Login', data, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          GlobaldataService.loginToken = res.data.user_token;
          await this.storage.setObject('login_token', res.data.user_token);
          await this.analytics.logEvent('login', null);
          this.general.goToPage('selectuser');
        } else {
          this.general.presentToast(res.message)
        }
      },
      error: async (err: any) => {
        await this.general.stopLoading();
      },
    })
  }

}
