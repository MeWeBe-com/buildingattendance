import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonToggle } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, IonIcon, IonToggle]
})
export class CheckoutPage implements OnInit {


  http = inject(HttpService);
  general = inject(GeneralService);
  analytics = inject(AnalyticsService);

  user: any;

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user = GlobaldataService.userObject;
  }

  async ionViewDidEnter() {
    await this.analytics.setCurrentScreen('Checkout Page');
  }

  checkOut() {
    this.http.get('CheckOut', true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          await this.analytics.logEvent('Check-Out', { user_id: this.user.user_id })
          this.general.presentToast(res.message)
          this.general.goToRoot('home');
        } else {
          this.general.presentToast(res.message)
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
      },
    })
  }

  onChange(e: any) {
    this.http.post('CheckOutManual', { property_id: this.user.property_id }, true).subscribe({
      next: async (res: any) => {
        console.log(res)
        await this.general.stopLoading();
        await this.analytics.logEvent('manual_check_out', { user_id: this.user.user_id, propert_id: this.user.propert_id });
        await this.general.presentToast(res.message);
        this.general.goToRoot('home');
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err);
      },
    })
  }

}
