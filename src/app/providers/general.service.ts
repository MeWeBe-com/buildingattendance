import { inject, Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, ModalController, MenuController, NavController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { StorageService } from './storage.service';
import { GlobaldataService } from './globaldata.service';
import { EventsService } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  loading: any;

  alertController = inject(AlertController);
  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  modalController = inject(ModalController);
  router = inject(Router);
  menu = inject(MenuController);
  navController = inject(NavController);
  sanitizer = inject(DomSanitizer);
  _location = inject(Location);
  storage = inject(StorageService);
  events = inject(EventsService);

  validateEmail(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true
    }
    return false
  }

  async presentAlert(h: string, m: string) {
    const alert = await this.alertController.create({
      header: h,
      message: m,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(m: string, d = 2000) {
    const toast = await this.toastController.create({
      message: m,
      duration: d
    });
    toast.present();
  }

  async presentLoading(m = 'Please Wait') {
    this.loading = await this.loadingController.create({
      message: m,
      showBackdrop: true
    });
    await this.loading.present();
  }

  async stopLoading() {
    if (this.loading) {
      await this.loadingController.dismiss();
    } else {
      setTimeout(async () => {
        await this.loadingController.dismiss();
      }, 2000);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  goToPage(page: string) {
    this.router.navigate(['/' + page]);
  }

  goToPagewithParam(page: string, data: any, locationChange: boolean = true) {
    this.router.navigate(['/' + page, { queryParams: data }], { skipLocationChange: locationChange });
  }

  goToPageWithQuery(page: string) {
    this.router.navigateByUrl('/' + page)
  }

  goBack() {
    this.navController.back();
  }

  goToRoot(page: string) {
    this.navController.navigateRoot('/' + page)
  }

  toggleMenu() {
    this.menu.toggle();
  }

  openPopover(e:any){
    this.events.publishPopover(e);
    this.events.publishOnPopover(true);
  }

  sideMenuEnable(bool: boolean) {
    this.menu.enable(bool);
  }

  sanitizeHtml(html: any) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  checkSizeArray(arr: any) {
    let testArr: any = [];
    for (let i = 0; i < arr.length; i++) {
      let selected = false;
      for (let j = 0; j < arr[i].types_size.length; j++) {
        if (arr[i].types_size[j].selected_size) {
          selected = true;
          break;
        }
      }
      if (!selected) {
        testArr.push({ mainIndex: i });
      }
    }
    if (testArr.length === 0) {
      return false
    } else {
      return true
    }
  }

  getRandomColor() {
    let color = "#";
    for (let i = 0; i < 3; i++) {
      let part = Math.round(Math.random() * 255).toString(16);
      color += (part.length > 1) ? part : "0" + part;
    }
    return color;
  }

  chanegUrl(url: string) {
    this._location.replaceState(url);
  }

  getImageExtension(base64: string): string | null {
    // Extract the MIME type using a Regular Expression
    const match = base64.match(/^data:image\/([a-zA-Z]+);base64,/);
    if (match) {
      return '.' + match[1]; // Return the extension (e.g., 'png', 'jpeg')
    }
    return null; // Return null if not found
  }


  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

}