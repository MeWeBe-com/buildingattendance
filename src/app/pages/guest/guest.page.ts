import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonButton } from '@ionic/angular/standalone';
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { StorageService } from 'src/app/providers/storage.service';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.page.html',
  styleUrls: ['./guest.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonButton
  ]
})
export class GuestPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  analytics = inject(AnalyticsService);
  storage = inject(StorageService);

  companies: any = [];
  company_id: any = null;

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getCompanies();
  }

  getCompanies() {
    this.http.get2('GetCompanies', false).subscribe({
      next: (res: any) => {
        this.companies = res.data.company;
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  submit() {
    if (!this.company_id) {
      this.general.presentToast('Please select company')
      return
    }

    this.http.post('UpdateGuestCompany', { company_id: this.company_id }, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          GlobaldataService.userObject = res.data;
          await this.storage.setObject('CBREuserObject', res.data);
          await this.analytics.setUserId(res.data.user_id)
          await this.analytics.logEvent('guest-account-setup', { user_id: res.data.user_id });
          this.general.goToRoot('home');
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
        console.log(err)
      },
    })
  }



}
