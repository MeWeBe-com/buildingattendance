import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonCheckbox } from '@ionic/angular/standalone';
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { Title } from '@angular/platform-browser';
import { GlobaldataService } from 'src/app/providers/globaldata.service';

@Component({
  selector: 'app-activeoccupants',
  templateUrl: './activeoccupants.page.html',
  styleUrls: ['./activeoccupants.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonCheckbox
  ]
})
export class ActiveoccupantsPage implements OnInit {

  http = inject(HttpService);
  general = inject(GeneralService);
  analytics = inject(AnalyticsService);
  titleService = inject(Title);

  user: any = null;

  users: any = [];

  intervalId: any;
  constructor() { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.user = GlobaldataService.userObject;
    this.getUsers();
    await this.analytics.setCurrentScreen('Active-occupants');
  }

  getUsers() {
    this.http.get(`GetCompanyUsers/${GlobaldataService.userObject.property_id}/fire`, false).subscribe({
      next: (res: any) => {
        this.users = res.data.users;
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  checkUseer(e: any) {
    this.http.get(`UpdateFireOccupant/${GlobaldataService.userObject.property_id}/${e.detail.value}/${e.detail.checked}`, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if(res.status == true){
          this.general.presentToast(res.message);
        }
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err)
      },
    })
  }

}
