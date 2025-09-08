import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobaldataService {

  constructor() { }

  public static deviceToken: string = '';
  public static userObject: any = undefined;
  public static loginToken: any = '';
  public static signupData: any = null;
  public static companies: any = [];
  public static selectedProperty:any = null;

  static clearGobal() {
    this.signupData = null
    this.userObject = undefined;
    this.loginToken = '';
  }
}