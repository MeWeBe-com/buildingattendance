import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, IonContent, IonIcon,]
})
export class CheckoutPage implements OnInit {


  http = inject(HttpService);
  general = inject(GeneralService);

  user: any;

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user = GlobaldataService.userObject;
  }

  checkOut() {
    this.http.get('CheckOut', true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
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

}
