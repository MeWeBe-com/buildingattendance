import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonInput, IonSelect, IonSelectOption, IonNote, IonButton, IonCheckbox, IonModal, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';

import { NgSelectComponent, NgOptionComponent } from '@ng-select/ng-select';
import { HttpService } from 'src/app/providers/http.service';
import { GeneralService } from 'src/app/providers/general.service';
import { AnalyticsService } from 'src/app/providers/analytics.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PreviousRouteService } from 'src/app/providers/previous-route.service';
import { GlobaldataService } from 'src/app/providers/globaldata.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectComponent, NgOptionComponent, RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonInput, IonSelect, IonSelectOption, IonNote, IonButton, IonCheckbox, IonModal, IonFab, IonFabButton, IonIcon
  ]
})
export class AddUserPage implements OnInit {
  @ViewChild('video', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('selfieInput', { static: false }) selfieInput!: ElementRef;
  @ViewChild('selfieInput2', { static: false }) selfieInput2!: ElementRef;

  http = inject(HttpService);
  general = inject(GeneralService);
  formBuilder = inject(FormBuilder);
  analytics = inject(AnalyticsService);
  aRoute = inject(ActivatedRoute);
  titleService = inject(Title);
  previousRouteService = inject(PreviousRouteService);

  companies: any = [];
  emergencyRoles: any = [];
  employmentRoles: any = [];
  positions: any = GlobaldataService.positions;
  shifts: any = GlobaldataService.shifts;

  signupForm!: FormGroup;
  isSubmitted: boolean = false;

  userType: string = '';

  isCameraModal: boolean = false;
  videoStream: MediaStream | null = null;
  capturedImage: string | null = null;

  constructor() {
    this.titleService.setTitle('Cocoon | Tablet');
  }

  ngOnInit() {
    this.initForm();
    this.aRoute.queryParams.subscribe(params => {
      if (params['type'] == 'guest' || params['type'] == 'employee') {
        this.userType = params['type'];

        if (this.userType == 'guest') {
          this.getCompanies('GetGuestCompanies')
        } else {
          this.getCompanies(`GetCompaniesByPropertyID/${GlobaldataService.userObject.property_id}`);
        }

        setTimeout(() => {
          this.signupForm.patchValue({
            type: this.userType
          })
          if (this.userType === 'employee') {
            this.signupForm.get('user_shift')?.setValidators(Validators.required);
            this.signupForm.get('emergency_role')?.setValidators(Validators.required);
            this.signupForm.get('visiting')?.clearValidators();
          } else if (this.userType === 'guest') {
            this.signupForm.get('visiting')?.setValidators(Validators.required);
            this.signupForm.get('emergency_role')?.clearValidators();
            this.signupForm.get('user_shift')?.clearValidators();
          }
          this.signupForm.get('visiting')?.updateValueAndValidity();
          this.signupForm.get('user_shift')?.updateValueAndValidity();
          this.signupForm.get('emergency_role')?.updateValueAndValidity();
          this.signupForm.get('company_name')?.updateValueAndValidity();

        }, 250);
      } else {
        this.general.goToRoot('select-user-type')
      }
    });
  }

  async ionViewWillEnter() {
    this.getEmergencyRoles();
    this.getEmploymentRoles();
    await this.analytics.setCurrentScreen('Add user by security');
  }

  getCompanies(url: string) {
    this.http.get2(url, false).subscribe({
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
      company_name: new FormControl(''),
      position: new FormControl('', Validators.required),
      emergency_role: new FormControl(''),
      employment_role: new FormControl('', Validators.required),
      employment_role_name: new FormControl(''),
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

    if (this.userType == 'guest' && this.signupForm.value.company_id == 'other' && this.signupForm.value.company_name == '') {
      return
    }

    if (this.userType == 'guest' && this.signupForm.value.employment_role == 'other' && this.signupForm.value.employment_role_name == '') {
      return
    }

    this.http.post('RegisterUser', this.signupForm.value, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.isSubmitted = false;
          this.signupForm.reset()
          this.general.presentToast(res.message);
          this.general.goToRoot('selectuser');
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
        if (this.isCameraModal) {
          this.closeModal();
        }
      },
      error: async (err) => {
        await this.general.stopLoading();
        console.log(err)
      },
    })
  }

  openCamera() {
    this.selfieInput2.nativeElement.click();
  }

  openModal() {
    this.isCameraModal = true;

  }

  async startCamera() {
    try {
      this.capturedImage = null;
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      const video = this.videoRef.nativeElement;
      video.srcObject = this.videoStream;
    } catch (error) {
      console.error('Camera error:', error);
      alert('Camera Not Found!');
    }
  }

  captureImage() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
    this.capturedImage = canvas.toDataURL('image/png');

  }

  closeModal() {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
    }
    this.capturedImage = null;
    this.isCameraModal = false;
  }

  doneCapture() {
    const blob = this.general.dataURItoBlob(this.capturedImage);

    // Create a File object from the Blob
    let fileName = Date.now().toString() + '.' + blob.type.split('/')[1];

    const file = new File([blob], fileName, { type: blob.type });

    if (file) {
      const formData = new FormData();
      formData.append('media', file);
      this.uploadImage(formData);
    }

  }



}
