import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralService } from './general.service';
import { GlobaldataService } from './globaldata.service';
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  general = inject(GeneralService);
  http = inject(HttpClient);

  constructor() { }

  post(link: string, data: any, loader: boolean) {
    if (loader == true) {
      this.general.presentLoading();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GlobaldataService.loginToken,
      'Accept': 'application/json'
    });
    let url = Capacitor.isNativePlatform() ? environment.baseUrl : environment.baseUrl2;
    return this.http.post(url + link, JSON.stringify(data), { headers: headers })
  }

  post2(link: string, data: any, loader: boolean) {
    if (loader == true) {
      this.general.presentLoading();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let url = Capacitor.isNativePlatform() ? environment.baseUrl : environment.baseUrl2;
    return this.http.post(url + link, JSON.stringify(data), { headers: headers })
  }

  get(link: string, loader: boolean) {
    if (loader == true) {
      this.general.presentLoading();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GlobaldataService.loginToken,
      'Accept': 'application/json'
    });
    let url = Capacitor.isNativePlatform() ? environment.baseUrl : environment.baseUrl2;
    return this.http.get(url + link, { headers: headers })

  }

  get2(link: string, loader: boolean) {
    if (loader == true) {
      this.general.presentLoading();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let url = Capacitor.isNativePlatform() ? environment.baseUrl : environment.baseUrl2;
    return this.http.get(url + link, { headers: headers })
  }

  uploadImages(formData: any, url: string, loader: boolean) {
    if (loader == true) {
      this.general.presentLoading();
    }
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + GlobaldataService.loginToken,
    });
    let urls = Capacitor.isNativePlatform() ? environment.baseUrl : environment.baseUrl2;
    return this.http.post(urls + url, formData, { headers: headers });
  }
}