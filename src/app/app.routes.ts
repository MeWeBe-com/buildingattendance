import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'signuppreview',
    loadComponent: () => import('./pages/signuppreview/signuppreview.page').then( m => m.SignuppreviewPage)
  },
  {
    path: 'selectlocation',
    loadComponent: () => import('./pages/selectlocation/selectlocation.page').then( m => m.SelectlocationPage)
  },
];
