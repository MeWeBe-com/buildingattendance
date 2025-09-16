import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { GlobaldataService } from 'src/app/providers/globaldata.service';

@Component({
  selector: 'app-select-user-type',
  templateUrl: './select-user-type.page.html',
  styleUrls: ['./select-user-type.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon
  ]
})
export class SelectUserTypePage implements OnInit {

  user: any = null;

  constructor() { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.user = GlobaldataService.userObject;
  }

}
