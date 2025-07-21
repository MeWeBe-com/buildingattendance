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

  companies: any = [
    { id: 1, company_name: 'CBRE' },
    { id: 2, company_name: 'Morgan Stanley' },
  ];

  constructor() { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      full_name: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      company: new FormControl('', Validators.required),
      emergency_role: new FormControl(''),
      email: new FormControl('', [Validators.email, Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      mobile: new FormControl('', Validators.required),
      //biometric_login: new FormControl(false, Validators.requiredTrue),
      terms: new FormControl(false, Validators.requiredTrue),
      profile_pic: new FormControl('')
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

    console.log(this.signupForm.value);
    GlobaldataService.signupData = this.signupForm.value;
    setTimeout(() => {
      this.general.goToPage('signuppreview')
    }, 50)

    // this.http.post2('signup', this.signupForm.value, true).subscribe({
    //   next: async (res: any) => {
    //     await this.general.stopLoading();
    //   },
    //   error: async (err: any) => {
    //     await this.general.stopLoading();
    //   },
    // })

  }

  selectPhoto() {
    this.selfieInput.nativeElement.click();
  }

  uploadSelfie(e: any) {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      this.uploadImage(formData);
    }

  }

  uploadImage(formData: any) {
    this.http.uploadImages(formData, 'UploadMedia', true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        this.selfieInput.nativeElement.value = '';
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err)
      },
    })
  }

}
