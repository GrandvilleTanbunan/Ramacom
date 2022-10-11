import { AuthService } from './auth.service';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  username = '';
  public appPages = [];
  public setting = [];

  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(public authService: AuthService) {
    this.authService.loginStatus$.subscribe((isLoggedIn) => {
      if (isLoggedIn == 'admin') {
        console.log('ini adalah admin')

      }
      else {
        console.log('ini BUKAN admin')

      }

    })
  

  
  // ionViewWillEnter(){
  //   this.authService.loginStatus$.subscribe((isLoggedIn) => {
  //     if (isLoggedIn == 'admin') {
  //       console.log('ini adalah admin')

  //     }
  //     else {
  //       console.log('ini BUKAN admin')

  //     }

  //   })
  
    // if(this.authService.isAdmin())
    // {
    //   console.log('ini adalah admin')
    //   this.appPages = [
    //     { title: 'Stock', url: '/stock-admin', icon: '/assets/images/stock.png' },
    //     { title: 'Penjualan', url: '/penjualan-admin', icon: '/assets/images/selling.png' },
    //     { title: 'Pembelian', url: '/pembelian-admin', icon:'/assets/images/buy.png' },
    //   ];

    //   this.setting = [
    //     { title: 'Pengaturan', url: '/home/Stock', icon: '/assets/images/setting.png' },
    //     { title: 'Logout', url: '/home/Stock', icon: '/assets/images/logout.png' },
    //   ]
    // }
    // else
    // {
    //   console.log('ini bukan admin')
    // }
  }
}
