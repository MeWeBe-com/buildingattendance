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

  static clearGobal() {
    this.userObject = undefined;
    this.loginToken = '';
  }
}