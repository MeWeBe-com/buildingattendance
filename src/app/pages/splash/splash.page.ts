import { Component, inject, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { GeneralService } from 'src/app/providers/general.service';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent]
})
export class SplashPage implements OnInit {

  general = inject(GeneralService);

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.general.goToPage('home');
    }, 2500)
  }

}
