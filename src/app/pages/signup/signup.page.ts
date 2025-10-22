import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonButtons, IonBackButton, IonCheckbox, IonSelect, IonSelectOption, IonNote } from '@ionic/angular/standalone';
import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';

import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgSelectComponent, NgOptionComponent,
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonButtons, IonBackButton, IonCheckbox, IonSelect, IonSelectOption, IonNote
  ]
})
export class SignupPage implements OnInit {
  @ViewChild('selfieInput', { static: false }) selfieInput!: ElementRef;

  http = inject(HttpService);
  general = inject(GeneralService);
  formBuilder = inject(FormBuilder);
  analytics = inject(AnalyticsService);

  signupForm!: FormGroup;
  isSubmitted: boolean = false;

  companies: any = [];
  emergencyRoles: any = [];
  employmentRoles: any = [];
  positions: any = GlobaldataService.positions;
  shifts: any = GlobaldataService.shifts;
  isEmailTaken: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initForm()
  }

  async ionViewWillEnter() {
    this.getCompanies();
    this.getEmergencyRoles();
    this.getEmploymentRoles();
    await this.analytics.setCurrentScreen('SignUp')
  }

  getCompanies() {
    this.http.get2('GetCompanies', false).subscribe({
      next: (res: any) => {
        GlobaldataService.companies = res.data.company;
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
      full_name: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      company_id: new FormControl('', Validators.required),
      emergency_role: new FormControl(null),
      employment_role: new FormControl('', Validators.required),
      email_address: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      mobile_number: new FormControl('', Validators.required),
      biometric_login: new FormControl(false, Validators.requiredTrue),
      terms: new FormControl(false, Validators.requiredTrue),
      profile_pic: new FormControl(''),
      user_shift: new FormControl('', Validators.required),

      company_name: new FormControl(''),
      company_color: new FormControl(''),
      emergency_name: new FormControl(''),
      profile_pic_url: new FormControl(''),
      shift_name: new FormControl(''),
      position_name: new FormControl(''),
      employment_name: new FormControl(''),
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
    let company = this.companies.find((com: any) => com.company_id == this.signupForm.value.company_id);
    let emergencyRole = this.emergencyRoles.filter((r: any) => this.signupForm.value.emergency_role.includes(r.id)).map((item: any) => item.name);
    let position_name = this.positions.find((p: any) => p.value == this.signupForm.value.position);
    let shift_name = this.shifts.find((s: any) => s.value == this.signupForm.value.user_shift);
    let employment_role = this.employmentRoles.find((e: any) => e.id == this.signupForm.value.employment_role);

    this.signupForm.patchValue({
      company_name: company.company_name,
      company_color: company.company_color,
      emergency_name: emergencyRole ? emergencyRole.join(', ') : '',
      shift_name: shift_name.name,
      position_name: position_name.name,
      employment_name: employment_role.name
    });

    GlobaldataService.signupData = this.signupForm.value;
    this.http.post2('CheckUserEmail', { email_address: this.signupForm.value.email_address }, true).subscribe({
      next: async (res: any) => {
        this.general.stopLoading()
        if (res.status) {
          this.isEmailTaken = false;
          this.general.goToPage('signuppreview')
        } else {
          this.isEmailTaken = true;
          this.general.presentToast('Email already in use!')
        }
      },
      error: async (err) => {
        this.general.stopLoading()

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
