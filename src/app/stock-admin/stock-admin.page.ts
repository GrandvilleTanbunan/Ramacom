import { Component, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController, ToastController } from '@ionic/angular';
import { App } from '@capacitor/app';
import { DataService } from './../services/data.service';
import { collection } from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc } from '@angular/fire/firestore';





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
  lengkapikolom: string;
  public tmptype = [];

  customPopoverOptions = {
    header: 'Pilih Kategori',
  };


  constructor(private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
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

  
  public optionsBrand(): void {
    this.dataService.getType(this.selectedbrand).subscribe(res => {
      this.tmptype = res;
      console.log(this.tmptype);

    });

    this.selectedtype = "";
  }

  public OptionType(): void {
    // this.dataService.getType(this.selectedbrand).subscribe(res => {
    //   this.tmptype = res;
    //   console.log(this.tmptype);

    // });

    console.log(this.selectedtype);

  }

  async addBrand() {

    const prompt= await this.alertCtrl.create({
      header: 'Tambah Brand',
      cssClass: 'my-custom-alert',
      // message: 'enter text',
      inputs: [
        {
          name: 'namabrand',
          placeholder: 'Nama Brand'
        }
      ],
      buttons: [{
          text: 'Batal',
          role: 'cancel',
          cssClass:'my-custom-alert-buttons'
        }, {
          text: 'Tambah',
          cssClass:'my-custom-alert-buttons',
          handler: (res) => {
            if(res.namabrand==""){
              prompt.message = "Nama brand tidak boleh kosong!";
              
              return false;
            }
            else{
              console.log(res);
              this.dataService.addBrand(res);

            }
          }
        }
      ]
    });
    await prompt.present();

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
