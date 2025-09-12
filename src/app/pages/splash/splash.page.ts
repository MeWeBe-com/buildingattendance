import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { GeneralService } from 'src/app/providers/general.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent]
})
export class SplashPage implements OnInit {
  @ViewChild('player') videoPlayer!: ElementRef;
  general = inject(GeneralService);

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.videoPlayer.nativeElement.playbackRate = '1.5';
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (Capacitor.isNativePlatform()) {
        this.general.goToRoot('home');
      } else {
        this.general.goToRoot('web-login');
      }
    }, 4500)
  }

  goTo() {
    if (Capacitor.isNativePlatform()) {
      this.general.goToRoot('home');
    } else {
      this.general.goToRoot('web-login');
    }
  }

}
