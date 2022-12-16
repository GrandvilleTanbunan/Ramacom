import { AuthService } from './auth.service';
import { Component } from '@angular/core';
import { AlertController, IonRouterOutlet, NavController, Platform } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DataService } from './services/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  
  public appPages = [];
  public setting = [];
  public loggeduser;
  public tmpuser = [];
  public tmpusername;
  
  
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private db: AngularFirestore, private  dataService: DataService, private authService: AuthService, private navCtrl: NavController, public platform: Platform, public alertCtrl: AlertController) {

    const auth = getAuth();

    //INI SAAT KELUAR APLIKASI TERUS MASUK LAGI
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email;
        console.log(email);
        this.db.collection('Users', ref => ref.where('email', '==', `${email}`))
          .valueChanges()
          .subscribe(data => {
            this.tmpusername = data;
            this.loggeduser = this.tmpusername[0].username;
            console.log(this.loggeduser);
            this.cekadmin();
            
          }

          );
      } else {
        console.log("Belum ada yang login")
      }
    });

    

    //INI SAAT LOGIN
  //   this.authService.loginStatus$.subscribe((isLoggedIn) => {
  //     console.log(isLoggedIn);
  //     if(isLoggedIn == "admin"){
  //       console.log('Ini admin');
  //       this.loggeduser = isLoggedIn;
  //       this.appPages = [
  //         { title: 'Stock', url: '/stock-admin', icon: '/assets/images/stock.png' },
  //         { title: 'Penjualan', url: '/penjualan-admin', icon: '/assets/images/selling.png' },
  //         { title: 'Kategori', url: '/pembelian-admin', icon:'/assets/images/buy.png' },
  //         { title: 'Daftar Harga', url: '/pembelian-admin', icon:'/assets/images/price-list-grey.png' },

  //         { title: 'Pengaturan', url: '/home/Stock', icon: '/assets/images/setting.png' }
  //       ];
  //       this.setting = [
  //         { title: 'Logout', url: '/home/Stock', icon: '/assets/images/logout.png'},
  //       ]
  //     }
  //     else
  //     {
  //       this.loggeduser = isLoggedIn;
  //       this.appPages = [
  //         { title: 'Stock', url: '/stock-cabang', icon: '/assets/images/stock.png' },
  //         { title: 'Penjualan', url: '/penjualan-cabang', icon: '/assets/images/selling.png' },
  //         { title: 'Pengaturan', url: '/home/Stock', icon: '/assets/images/setting.png' }
  //       ];
  //       this.setting = [
  //         { title: 'Logout', url: '/home/Stock', icon: '/assets/images/logout.png' },
  //       ]
  //       console.log('Ini BUKAN admin');
  //     }
  // })
  
  }

  cekadmin()
  {
    if (this.loggeduser == "admin") {
      console.log('Ini admin');
      this.appPages = [
        { title: 'Stock Handphone', url: '/stock-admin', icon: '/assets/images/handphone.png' },
        { title: 'Stock Lain', url: '/stock-admin', icon: '/assets/images/stock1.png' },
        { title: 'Daftar Harga', url: '/daftarharga', icon: '/assets/images/price-list1.png' },
        { title: 'Penjualan', url: '/penjualan-admin', icon: '/assets/images/sell.png' },
        { title: 'Kategori', url: '/kategori', icon: '/assets/images/web.png' },

        { title: 'Pengaturan', url: '/home/Stock', icon: '/assets/images/setting1.png' }
      ];
      this.setting = [
        { title: 'Logout', url: '/home/Stock', icon: '/assets/images/logout.png' },
      ]
    }
    else {
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
          handler: async () => {
          console.log('Mau Logout!');
          await this.authService.logout();
          // this.router.navigateByUrl('/', {replaceUrl:true});
          this.navCtrl.navigateRoot('/', {replaceUrl: true});
          }
        }
      ]
    });
    await alert.present();
  }
}
