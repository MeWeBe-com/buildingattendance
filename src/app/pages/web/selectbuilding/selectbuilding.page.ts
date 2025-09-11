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
  selector: 'app-selectbuilding',
  templateUrl: './selectbuilding.page.html',
  styleUrls: ['./selectbuilding.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonButton
  ]
})
export class SelectbuildingPage implements OnInit {

  general = inject(GeneralService)
  http = inject(HttpService);
  analytics = inject(AnalyticsService);

  properties: any = [];
  building_id: any;

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getProperties();
  }

  getProperties() {
    this.http.get('GetPropertiesByCompanyID', true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading()
        if (res.status == true) {
          this.properties = res.data;
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
        console.log(err)
      }
    })
  }

  submit() {
    this.general.goToPage('selectuser');
  }

}
