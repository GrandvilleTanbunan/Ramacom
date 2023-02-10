import { AuthService } from './auth.service';
import { Component } from '@angular/core';
import { AlertController, IonRouterOutlet, NavController, Platform, ModalController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { DataService } from './services/data.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { App } from '@capacitor/app';
import {take , map, switchMap} from 'rxjs/operators';
import { Router, RouterEvent } from '@angular/router';
import { NotificationPage } from './notification/notification.page';
import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  [x: string]: any;
  
  public appPages = [];
  public setting = [];
  public loggeduser;
  public tmpuser = [];
  public tmpusername;
  public ctrnotif = 0;
  public tmpnotif = [];
  selectedPath = '';
  
  constructor(private modalCtrl: ModalController, private router: Router,private db: AngularFirestore, private  dataService: DataService, private authService: AuthService, private navCtrl: NavController, public platform: Platform, public alertCtrl: AlertController) {
    const auth = getAuth();
    // const user = auth.currentUser;
    // console.log("current user: ", user);

    //INI SAAT KELUAR APLIKASI TERUS MASUK LAGI
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log(user)
        const email = user.email;
        // console.log(email);
        this.db.collection('Users', ref => ref.where('email', '==', `${email}`))
          .valueChanges().pipe(take(1))
          .subscribe(data => {
            this.tmpusername = data;
            // console.log(this.tmpusername)
            this.loggeduser = this.tmpusername[0].username;
            // console.log(this.loggeduser);
            this.authService.setloggeduser(this.loggeduser);

            this.cekadmin();
            
          }

          );
      } else {
        console.log("Belum ada yang login")
      }
    });

    this.getnotif();
  }

  cekadmin()
  {
    if (this.loggeduser == "admin") {
      console.log("Masuk cek admin mau masukkin ke statuschange")
      this.authService.setloggeduser(this.loggeduser);
      // console.log('Ini admin');
      this.appPages = [
        { title: 'Penjualan', url: '/penjualan-admin', icon: '/assets/images/sell.png' },
        { title: 'Stock Handphone', url: '/stock-admin', icon: '/assets/images/handphone.png' },
        { title: 'Stock Lain', url: '/stocklain', icon: '/assets/images/stock.png' },
        { title: 'Daftar Harga', url: '/daftarharga', icon: '/assets/images/price-list.png' },
        // { title: 'Laporan Penjualan', url: '/penjualan-admin', icon: '/assets/images/transactionreport.png' },
        { title: 'Kategori', url: '/kategori', icon: '/assets/images/categories.png' },

        { title: 'Pengaturan', url: '/pengaturan', icon: '/assets/images/setting1.png' }
      ];
      this.setting = [
        { title: 'Logout', url: '/login', icon: '/assets/images/logout.png' },
      ]
    }
    else {
      console.log("Masuk cek admin mau masukkin ke statuschange")
      this.authService.setloggeduser(this.loggeduser);

      this.appPages = [
        { title: 'Penjualan', url: '/transaksi', icon: '/assets/images/sell.png' },
        { title: 'Stock Handphone', url: '/stock-admin', icon: '/assets/images/handphone.png' },
        { title: 'Stock Lain', url: '/stocklain', icon: '/assets/images/stock.png' },
        { title: 'Daftar Harga', url: '/daftarharga', icon: '/assets/images/price-list.png' },
        // { title: 'Kategori', url: '/kategori', icon: '/assets/images/categories.png' },

        // { title: 'Penjualan', url: '/penjualan-admin', icon: '/assets/images/sell.png' },
        // { title: 'Pengaturan', url: '/pengaturan', icon: '/assets/images/setting1.png' }
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
      
      subHeader: 'Anda yakin ingin logout?',
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

          this.router.navigateByUrl('/', {replaceUrl:true});
          // this.navCtrl.navigateRoot('/', {replaceUrl: true});
          // App.exitApp();

          }
        }
      ]
    });
    await alert.present();
  }


  async ShowNotif()
  {
    const modal = await this.modalCtrl.create({
      component: NotificationPage,
      cssClass:'large-modal',
      componentProps: {
        // detailitem: item,
        // IDBrand: this.selectedbrand,
        // kategori: this.selectedKategori
      },
    });
    await modal.present();
  }

  getnotif() {
    // this.ctrnotif;
    this.db.collection('Pemberitahuan', ref => ref.orderBy('timestamp', "desc"))
      .valueChanges({ idField: 'NotifID' })
      .subscribe(data => {
        this.tmpnotif = data;
        console.log(this.tmpnotif);
        this.ctrnotif = 0;
        for(let i=0; i<this.tmpnotif.length; i++)
        {
          if(this.tmpnotif[i].read == "1")
          {
            this.ctrnotif++;
          }
        }
        console.log(this.ctrnotif);

      }
      );
  }


}
