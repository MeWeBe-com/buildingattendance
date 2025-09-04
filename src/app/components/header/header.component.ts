import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton } from '@ionic/angular/standalone';

import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule,
    IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonButton
  ]
})
export class HeaderComponent implements OnInit {


  general = inject(GeneralService);

  @Input() title: string = '';
  @Input() selected: any = undefined;
  @Input() showMenu: boolean = false;
  user: any;

  constructor() { }

  ngOnInit() {
    this.user = GlobaldataService.userObject;
  }

}
