import { Component, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';


@Component({
  selector: 'app-stock-admin',
  templateUrl: './stock-admin.page.html',
  styleUrls: ['./stock-admin.page.scss'],
})
export class StockAdminPage implements OnInit {
  brand: Array<string>;
  kategori: Array<string>;
  selectedbrand: string;

  customPopoverOptions = {
    header: 'Pilih Kategori',
  };


  constructor(public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.presentConfirm();
        // App.exitApp();
        
      }
    });


    this.brand = ["Oppo", "Vivo", "Samsung", "Advan", "Asus", "Infinix", "Mito", "Xiaomi"];
    this.kategori = ["Handphone", "Aksesoris"];

    
   }
   async presentConfirm() {
    let alert = await this.alertCtrl.create({
      
      message: 'Anda yakin ingin keluar aplikasi?',
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
            App.exitApp();
          }
        }
      ]
    });
    await alert.present();
  }

  public optionsFn(): void { //here item is an object 
    console.log(this.selectedbrand);

  }


  ngOnInit() {

  }

}
