import { AuthService } from './auth.service';
import { Component } from '@angular/core';
import { AlertController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  
  public appPages = [];
  public setting = [];
  public loggeduser;
  
  
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private authService: AuthService, private navCtrl: NavController, public platform: Platform, public alertCtrl: AlertController) {
    this.authService.loginStatus$.subscribe((isLoggedIn) => {
      if(isLoggedIn == "admin"){
        console.log('Ini admin');
        this.loggeduser = isLoggedIn;
        this.appPages = [
          { title: 'Stock', url: '/stock-admin', icon: '/assets/images/stock.png' },
          { title: 'Penjualan', url: '/penjualan-admin', icon: '/assets/images/selling.png' },
          // { title: 'Pembelian', url: '/pembelian-admin', icon:'/assets/images/buy.png' },
          { title: 'Daftar Harga', url: '/pembelian-admin', icon:'/assets/images/price-list-grey.png' },

          { title: 'Pengaturan', url: '/home/Stock', icon: '/assets/images/setting.png' }
        ];
        this.setting = [
          { title: 'Logout', url: '/home/Stock', icon: '/assets/images/logout.png'},
        ]
      }
      else
      {
        this.loggeduser = isLoggedIn;
        this.appPages = [
          { title: 'Stock', url: '/stock-cabang', icon: '/assets/images/stock.png' },
          { title: 'Penjualan', url: '/penjualan-cabang', icon: '/assets/images/selling.png' },
          { title: 'Pengaturan', url: '/home/Stock', icon: '/assets/images/setting.png' }
        ];
        this.setting = [
          { title: 'Logout', url: '/home/Stock', icon: '/assets/images/logout.png' },
        ]
        console.log('Ini BUKAN admin');
      }
  })
  }

  async logout()
  {
       let alert = await this.alertCtrl.create({
      
      message: 'Anda yakin ingin logout?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'YA',
          handler: () => {
          console.log('Mau Logout!');
          this.authService.logout();
          this.navCtrl.navigateRoot('login');
          }
        }
      ]
    });
    await alert.present();
  }
}
