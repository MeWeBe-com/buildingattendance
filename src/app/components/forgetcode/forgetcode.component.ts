import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralService } from 'src/app/providers/general.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { HttpService } from 'src/app/providers/http.service';
import { IonContent, IonHeader, IonFooter, IonToolbar, IonButton, IonButtons, IonIcon, IonInput, IonText, AlertController, IonPopover, IonTitle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgetcode',
  templateUrl: './forgetcode.component.html',
  styleUrls: ['./forgetcode.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    IonContent, IonHeader, IonFooter, IonToolbar, IonButton, IonButtons, IonIcon, IonInput, IonText, IonPopover, IonTitle
  ]
})
export class ForgetcodeComponent implements OnInit {
  showForm: boolean = false;
  passwordForm!: FormGroup;
  showPass: boolean = false;

  @ViewChild('inputOne', { static: false }) ionInputOne!: any;
  @ViewChild('inputTwo', { static: false }) ionInputTwo!: any;
  @ViewChild('inputThree', { static: false }) ionInputThree!: any;
  @ViewChild('inputFour', { static: false }) ionInputFour!: any;

  isForgetPassPop: boolean = false;

  constructor(
    public general: GeneralService,
    public http: HttpService,
    public formBuilder: FormBuilder,
    public alertController: AlertController
  ) { }

  code = {
    one: '',
    two: '',
    three: '',
    four: ''
  }

  ngOnInit() {
    this.initForm();
    setTimeout(() => {
      this.isForgetPassPop = true;
    })
  }

  initForm() {
    this.passwordForm = this.formBuilder.group({
      email_address: new FormControl(''),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$]/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/[A-Z]/),
        Validators.pattern(/[a-z]/),
        Validators.pattern(/[0-9]/),
        Validators.pattern(/[!@#$]/),
      ]),
    })
  }

  get getControl() {
    return this.passwordForm.controls;
  }

  change(e: any, i: any) {
    const inputValue = e.target.value;
    if (!/^\d+$/.test(inputValue)) {
      return;
    }

    if (i == 1 && inputValue) {
      this.code.one = inputValue;
      setTimeout(() => this.ionInputTwo.setFocus(), 0);
    } else if (i == 2 && inputValue) {
      this.code.two = inputValue;
      setTimeout(() => this.ionInputThree.setFocus(), 0);
    } else if (i == 3 && inputValue) {
      this.code.three = inputValue;
      setTimeout(() => this.ionInputFour.setFocus(), 0);
    } else if (i == 4 && inputValue) {
      this.code.four = inputValue;
    }
  }

  submit() {
    let a = { verification_key: this.code.one + this.code.two + this.code.three + this.code.four };
    this.http.post2('ValidateCode', a, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading()
        if (res.status == true) {
          this.showForm = true;
          this.passwordForm.patchValue({
            email_address: res.data
          })
        } else {
          this.general.presentToast(res.data.message);
        }
      },
      error: async (e) => {
        await this.general.stopLoading()
        console.log(e);
      }
    })
  }

  onSubmit() {
    if (this.passwordForm.invalid || this.passwordForm.value.password != this.passwordForm.value.confirmPassword) {
      return
    }
    this.http.post2('UserPasswordUpdate', this.passwordForm.value, true).subscribe({
      next: async (res: any) => {
        await this.general.stopLoading();
        if (res.status == true) {
          this.general.presentToast(res.message);
          this.general.closeModal();
        } else {
          this.general.presentToast(res.message);
        }
      },
      error: async (err: any) => {
        await this.general.stopLoading();
        console.log(err)
      }
    })
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Enter Email Address',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Enter Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if (!this.general.validateEmail(data.email)) {
              this.general.presentToast('Enter Correct Email');
            } else {
              this.sendEmail(data.email);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  sendEmail(email: any) {
    this.http.post2('ForgetPassword', { email: email }, true).subscribe((res: any) => {
      if (res.status == true) {
        this.general.presentToast(res.data.message);
      } else {
        this.general.presentToast(res.data.message);
      }
    })
  }

}