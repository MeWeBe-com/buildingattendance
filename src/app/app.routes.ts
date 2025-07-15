import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'signuppreview',
    loadComponent: () => import('./pages/signuppreview/signuppreview.page').then(m => m.SignuppreviewPage)
  },
  {
    path: 'selectlocation',
    loadComponent: () => import('./pages/selectlocation/selectlocation.page').then(m => m.SelectlocationPage)
  }
];
