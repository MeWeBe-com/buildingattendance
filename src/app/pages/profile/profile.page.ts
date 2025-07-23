import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonCheckbox, IonSelect, IonSelectOption, IonNote } from '@ionic/angular/standalone';

import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';
import { StorageService } from 'src/app/providers/storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    IonContent, IonInput, IonButton, IonCheckbox, IonSelect, IonSelectOption, IonNote
  ]
})
export class ProfilePage implements OnInit {
  @ViewChild('selfieInput', { static: false }) selfieInput!: ElementRef;

  http = inject(HttpService);
  general = inject(GeneralService);
  formBuilder = inject(FormBuilder);
  storage = inject(StorageService);

  profileForm!: FormGroup;
  isSubmitted: boolean = false;

  companies: any = [];

  passwordForm!: FormGroup;
  isPSubmitted: boolean = false;

  constructor() { }

  ngOnInit() {
    this.initForm();
    this.initPasswordForm();
    this.profileForm.patchValue(GlobaldataService.userObject);
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
    this.profileForm = this.formBuilder.group({
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
    return this.profileForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.profileForm.invalid) {
      this.general.presentToast('Please fill form correctly!')
      return
    }

    this.http.post('UpdateUserProfile', this.profileForm.value, true).subscribe({
      next: async (res: any) => {
        console.log(res);
        await this.general.stopLoading();
        if (res.status == true) {
          GlobaldataService.userObject = res.data;
          await this.storage.setObject('CBREuserObject', res.data);
          this.general.presentToast(res.message)
        }
      },
      error: async (err) => {
        await this.general.stopLoading()

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
          this.profileForm.patchValue({
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

  initPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      old_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$%^&*]/),
      ]),
      new_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$%^&*]/),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$%^&*]/),
      ])
    })
  }

  get getPassControl() {
    return this.passwordForm.controls;
  }

  onPasswordSubmit() {
    this.isPSubmitted = true;
    if (this.passwordForm.invalid || (this.getPassControl['new_password'].value != this.getPassControl['confirm_password'].value)) {
      this.general.presentToast('Please fill form correctly!')
      return
    }

    this.http.post('UpdateUserPassword', this.passwordForm.value, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.general.presentToast(res.message);
        } else {
          this.general.presentToast(res.message);
        }
        this.isPSubmitted = false;
        this.passwordForm.reset()
      },
      error: async (err) => {
        await this.general.stopLoading()

      },
    })
  }

}
