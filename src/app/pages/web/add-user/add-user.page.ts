import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonSelect, IonSelectOption, IonNote, IonButton, IonCheckbox } from '@ionic/angular/standalone';

import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectComponent, NgOptionComponent,
    IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonSelect, IonSelectOption, IonNote, IonButton, IonCheckbox
  ]
})
export class AddUserPage implements OnInit {

  @ViewChild('selfieInput', { static: false }) selfieInput!: ElementRef;

  http = inject(HttpService);
  general = inject(GeneralService);
  formBuilder = inject(FormBuilder);
  analytics = inject(AnalyticsService);
  aRoute = inject(ActivatedRoute);

  companies: any = [];
  emergencyRoles: any = [];
  employmentRoles: any = [];
  positions: any = [
    {
      name: 'ICT Technician', value: 'ict_technician'
    },
    {
      name: 'Managed Services', value: 'managed_services'
    }
  ];
  shifts: any = [
    {
      name: 'Yellow', value: 'yellow'
    },
    {
      name: 'Blue', value: 'blue'
    },
    {
      name: 'Green', value: 'green'
    },
    {
      name: 'Red', value: 'red'
    }
  ];

  signupForm!: FormGroup;
  isSubmitted: boolean = false;

  userType: string = '';

  constructor() { }

  ngOnInit() {
    this.initForm();
    this.aRoute.queryParams.subscribe(params => {
      if (params['type'] == 'guest' || params['type'] == 'employee') {
        this.userType = params['type'];

        setTimeout(() => {
          this.signupForm.patchValue({
            type: this.userType
          })
          if (this.userType === 'employee') {
            this.signupForm.get('user_shift')?.setValidators(Validators.required);
            this.signupForm.get('visiting')?.clearValidators();
          } else if (this.userType === 'guest') {
            this.signupForm.get('visiting')?.setValidators(Validators.required);
            this.signupForm.get('user_shift')?.clearValidators();
          }
          this.signupForm.get('visiting')?.updateValueAndValidity();
          this.signupForm.get('user_shift')?.updateValueAndValidity();
        }, 250);
      } else {
        this.general.goToRoot('select-user-type')
      }
    });
  }

  async ionViewWillEnter() {
    this.getCompanies();
    this.getEmergencyRoles();
    this.getEmploymentRoles();
    await this.analytics.setCurrentScreen('Add user by security');
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

  getEmergencyRoles() {
    this.http.get2('GetEmergencyRoles', false).subscribe({
      next: (res: any) => {
        this.emergencyRoles = res.data.roles;
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  getEmploymentRoles() {
    this.http.get2('GetEmploymentRoles', false).subscribe({
      next: (res: any) => {
        this.employmentRoles = res.data.roles;
      },
      error: (err) => {
        console.log(err)
      },
    })
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      type: new FormControl(''),
      full_name: new FormControl('', Validators.required),
      company_id: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),

      emergency_role: new FormControl(''),

      user_shift: new FormControl(''),
      visiting: new FormControl(''),

      email_address: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      mobile_number: new FormControl('', Validators.required),
      terms: new FormControl(false, Validators.requiredTrue),

      profile_pic: new FormControl(''),
      profile_pic_url: new FormControl(''),
    })
  }

  get getControl() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.signupForm.invalid) {
      this.general.presentToast('Please fill form correctly!')
      return
    }

    this.http.post('RegisterUser', this.signupForm.value, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        console.log(res)
        if (res.status == true) {

        } else {
          this.general.presentToast(res.message)
        }
        this.selfieInput.nativeElement.value = '';
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err)
      },
    })
  }

  selectPhoto() {
    this.selfieInput.nativeElement.click();
  }

  uploadSelfie(e: any) {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append('media', e.target.files[0]);
      this.uploadImage(formData);
    }
  }

  uploadImage(formData: any) {
    this.http.uploadImages(formData, 'UploadMedia', true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.signupForm.patchValue({
            profile_pic: res.filename,
            profile_pic_url: res.media_url
          });
        } else {
          this.general.presentToast('Something went wrong!')
        }
        this.selfieInput.nativeElement.value = '';
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err)
      },
    })
  }

}
