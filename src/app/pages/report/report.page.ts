import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonContent, IonIcon, IonButton, IonTextarea, IonNote, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { GeneralService } from 'src/app/providers/general.service';
import { HttpService } from 'src/app/providers/http.service';
import { StorageService } from 'src/app/providers/storage.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { EventsService } from 'src/app/providers/events.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonContent, IonIcon, IonButton, IonTextarea, IonNote, IonSelect, IonSelectOption
  ]
})
export class ReportPage implements OnInit {

  general = inject(GeneralService);
  http = inject(HttpService);
  storage = inject(StorageService);
  formBuilder = inject(FormBuilder);
  analytics = inject(AnalyticsService);
  events = inject(EventsService);

  reportForm!: FormGroup;
  isSubmitted: boolean = false;
  properties: any = [];

  isOpen: boolean = false;

  constructor() {
    this.events.receiveOnPopover().subscribe((res: any) => {
      this.isOpen = res;
    })
  }

  ngOnInit() {
    this.initForm();
  }

  async ionViewWilLEnter() {
    await this.analytics.setCurrentScreen('Login');
  }

  ionViewDidEnter() {
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

  initForm() {
    this.reportForm = this.formBuilder.group({
      building_id: new FormControl('', Validators.required),
      message: new FormControl('', Validators.required)
    })
  }

  get getControl() {
    return this.reportForm.controls
  }

  onSubmit() {
    this.isSubmitted = true;

    if (this.reportForm.invalid) {
      this.general.presentToast('Please fill form correctly!')
      return
    }

    this.http.post('ReportIncident', this.reportForm.value, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status) {
          this.isSubmitted = false;
          this.reportForm.reset();
          this.general.presentToast(res.message);
          this.general.goToPage('home');
        } else {
          this.general.presentToast(res.message);
        }
      },
      error: async (err) => {
        await this.general.stopLoading()
        console.log(err)
      },
    })

  }

}
