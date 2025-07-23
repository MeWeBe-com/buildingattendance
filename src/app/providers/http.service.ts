import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralService } from './general.service';
import { GlobaldataService } from './globaldata.service';
import { environment } from 'src/environments/environment';

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
    return this.http.post(environment.baseUrl + link, JSON.stringify(data), { headers: headers })
  }

  post2(link: string, data: any, loader: boolean) {
    if (loader == true) {
      this.general.presentLoading();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(environment.baseUrl + link, JSON.stringify(data), { headers: headers })
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
    return this.http.get(environment.baseUrl + link, { headers: headers })
  }

  get2(link: string, loader: boolean) {
    if (loader == true) {
      this.general.presentLoading();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(environment.baseUrl + link, { headers: headers })
  }

  uploadImages(formData: any, url: string, loader: boolean) {
    if (loader == true) {
      this.general.presentLoading();
    }
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + GlobaldataService.loginToken,
    });
    return this.http.post(environment.baseUrl + url, formData, { headers: headers });
  }
}