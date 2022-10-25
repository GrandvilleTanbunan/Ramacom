import { Component, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { DataService } from './../services/data.service';



@Component({
  selector: 'app-stock-admin',
  templateUrl: './stock-admin.page.html',
  styleUrls: ['./stock-admin.page.scss'],
})
export class StockAdminPage implements OnInit {
  brand: Array<string>;
  public tmpbrand = [];
  kategori: Array<string>;
  selectedbrand: string;
  selectedtype: string;
  public tmptype = [];

  customPopoverOptions = {
    header: 'Pilih Kategori',
  };


  constructor(private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.presentConfirm();
        // App.exitApp();
        
      }
    });

    this.kategori = ["Handphone", "Aksesoris"];

    this.getBrand();
    
   }

  getBrand() {

    this.dataService.getBrand().subscribe(res => {
      this.tmpbrand = res;
      console.log(this.tmpbrand);

    });
  }

  
  public optionsFn(): void {
    console.log(this.selectedbrand);

    this.dataService.getType(this.selectedbrand).subscribe(res => {
      this.tmptype = res;
      console.log(this.tmptype);

    });
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

  ngOnInit() {

  }

}
