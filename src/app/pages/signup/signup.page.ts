import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonCheckbox, IonSelect, IonSelectOption, IonNote } from '@ionic/angular/standalone';

import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink,
    IonContent, IonInput, IonButton, IonCheckbox, IonSelect, IonSelectOption, IonNote
  ]
})
export class SignupPage implements OnInit {
  @ViewChild('selfieInput', { static: false }) selfieInput!: ElementRef;

  http = inject(HttpService);
  general = inject(GeneralService);
  formBuilder = inject(FormBuilder);

  signupForm!: FormGroup;
  isSubmitted: boolean = false;

  companies: any = [];

  constructor() { }

  ngOnInit() {
    this.initForm()
  }

  ionViewWillEnter() {
    this.getCompanies()
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

  initForm() {
    this.signupForm = this.formBuilder.group({
      full_name: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      company_id: new FormControl('', Validators.required),
      emergency_role: new FormControl(''),
      email_address: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      mobile_number: new FormControl('', Validators.required),
      //biometric_login: new FormControl(false, Validators.requiredTrue),
      terms: new FormControl(false, Validators.requiredTrue),
      profile_pic: new FormControl('', Validators.required),

      company_name: new FormControl(''),
      profile_pic_url: new FormControl('')
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
    this.signupForm.patchValue({
      company_name: company.company_name
    })
    GlobaldataService.signupData = this.signupForm.value;
    setTimeout(() => {
      this.general.goToPage('signuppreview')
    }, 50)

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
