import { Routes } from '@angular/router';
import { AuthGuard } from './providers/authguard.service';
import { CheckGuard } from './providers/checkinguard.service';

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
    canActivate: [AuthGuard]
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
    loadComponent: () => import('./pages/selectlocation/selectlocation.page').then(m => m.SelectlocationPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history.page').then(m => m.HistoryPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.page').then(m => m.CheckoutPage),
    canActivate: [AuthGuard, CheckGuard]
  },
  {
    path: 'emergency',
    loadComponent: () => import('./pages/emergency/emergency.page').then(m => m.EmergencyPage)
  },
  {
    path: 'report',
    loadComponent: () => import('./pages/report/report.page').then(m => m.ReportPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'directory',
    loadComponent: () => import('./pages/directory/directory.page').then(m => m.DirectoryPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'guest',
    loadComponent: () => import('./pages/guest/guest.page').then( m => m.GuestPage)
  },
  {
    path: 'selectuser',
    loadComponent: () => import('./pages/web/selectuser/selectuser.page').then( m => m.SelectuserPage)
  },
  {
    path: 'web-login',
    loadComponent: () => import('./pages/web/web-login/web-login.page').then( m => m.WebLoginPage)
  }

];
