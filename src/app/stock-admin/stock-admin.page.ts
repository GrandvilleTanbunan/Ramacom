import { Component, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController, ToastController, ModalController  } from '@ionic/angular';
// import { ModalExampleComponent } from './modal-example.component';
import { AddTypeModalComponent } from '../add-type-modal/add-type-modal.component';
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
  tmpbrand = [];
  tmptype = [];


  kategori: Array<string>;

  selectedbrand: string;
  selectedbrand_TYPE: string;
  selectedtype: string;

  masukannamabrand = false;
  masukannamatype = false;

  // namabrandbaru: string;
  tmpnamabrandbaru = "";
  tmpTypeBaru = "";
  // public namabrandbaru: 
  //   {
  //     namabrand: string;
  //   };

  customPopoverOptions = {
    header: 'Pilih Kategori',
  };


  constructor(private modalCtrl: ModalController, private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
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
    console.log(this.selectedtype);

  }

  async SaveBrand()
  {
    if (this.tmpnamabrandbaru == "") {
      console.log(this.tmpnamabrandbaru);
      this.masukannamabrand = true;
    }
    else {
      let alert = await this.alertCtrl.create({

        message: 'Anda yakin ingin menambahkan brand ini?',
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
              this.dataService.addBrand(this.tmpnamabrandbaru);
              this.tmpnamabrandbaru = "";
              const alert = await this.alertCtrl.create({
                subHeader: 'Brand berhasil ditambahkan!',
                buttons: ['OK'],
              });
              await alert.present();
              this.masukannamabrand = false;

            }
          }
        ]
      });
      await alert.present();
    }
    
  }

  

  async SaveType()
  {
    console.log(this.selectedbrand_TYPE);
    if (this.tmpTypeBaru == "") {
      console.log(this.tmpTypeBaru);
      this.masukannamatype = true;
    }
    else {
      let alert = await this.alertCtrl.create({

        message: 'Anda yakin ingin menambahkan tipe ini?',
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
              this.dataService.addType(this.selectedbrand_TYPE, this.tmpTypeBaru);
              this.tmpTypeBaru = "";
              const alert = await this.alertCtrl.create({
                subHeader: 'Tipe berhasil ditambahkan!',
                buttons: ['OK'],
              });
              await alert.present();
              this.masukannamatype = false;

            }
          }
        ]
      });
      await alert.present();
    }

  }

  Dismissmodal()
  {
    this.modalCtrl.dismiss();
    this.masukannamabrand = false;
    this.masukannamatype = false;
    this.selectedbrand_TYPE = "";
  }

 

  // async addBrand() {

  //   const prompt= await this.alertCtrl.create({
  //     header: 'Tambah Brand',
  //     cssClass: 'my-custom-alert',
  //     // message: 'enter text',
  //     inputs: [
  //       {
  //         name: 'namabrand',
  //         placeholder: 'Nama Brand'
  //       }
  //     ],
  //     buttons: [{
  //         text: 'Batal',
  //         role: 'cancel',
  //         cssClass:'my-custom-alert-buttons'
  //       }, {
  //         text: 'Tambah',
  //         cssClass:'my-custom-alert-buttons',
  //         handler: (res) => {
  //           if(res.namabrand==""){
  //             prompt.message = "Nama brand tidak boleh kosong!";
              
  //             return false;
  //           }
  //           else{
  //             console.log(res);
  //             this.dataService.addBrand(res);

  //           }
  //         }
  //       }
  //     ]
  //   });
  //   await prompt.present();

  // }

  // async addType() {

  //   this.openModal();
    

  // }

  // async openModal() {
  //   const modal = await this.modalCtrl.create({
  //     component: AddTypeModalComponent,
  //   });
  //   modal.present();

  //   const { data, role } = await modal.onWillDismiss();

  //   // if (role === 'confirm') {
  //   //   this.message = `Hello, ${data}!`;
  //   // }
  // }


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
