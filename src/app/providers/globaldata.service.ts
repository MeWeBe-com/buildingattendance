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
  public static selectedProperty: any = null;
  public static logoTop: number = 0;
  public static positions = [
    {
      name: 'Guest', value: 'guest'
    },
    {
      name: 'Contractor', value: 'contractor'
    },
    {
      name: 'Employee', value: 'employee'
    },
    {
      name: 'Client', value: 'client'
    }
  ];
  public static shifts = [
    {
      name: 'Blue', value: 'blue'
    },
    {
      name: 'Green', value: 'green'
    },
    {
      name: 'None', value: 'none'
    },
    {
      name: 'Red', value: 'red'
    },
    {
      name: 'Yellow', value: 'yellow'
    }
  ];

  static clearGobal() {
    this.signupData = null
    this.userObject = undefined;
    this.loginToken = '';
  }
}