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
  selectedbrand_TYPE = "";
  selectedtype: string;
  selectedbrand_HAPUS: string;
  selectedbrand_HAPUSTYPE = "";
  selectedtype_HAPUS = "";

  masukannamabrand = false;
  masukannamatype = false;
  pilihbrand = false;
  pilihbrandtambahtipe = false;
  pilihtipe_hapustipe = false;
  pilihbrand_hapustipe = false;

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

  public optionsBrandHAPUS(): void {
    this.dataService.getType(this.selectedbrand_HAPUSTYPE).subscribe(res => {
      this.tmptype = res;
      console.log(this.tmptype);

    });

    this.selectedtype = "";
  }

  public OptionType(): void {
    console.log(this.selectedtype);

  }

  public OptionTypeHAPUS(): void {
    console.log(this.selectedtype_HAPUS);

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
    if(this.selectedbrand_TYPE == "" && this.tmpTypeBaru != "")
    {
      console.log("brand belum terpilih dan tipe sudah");
      this.pilihbrandtambahtipe = true;
      this.masukannamatype = false;
    }
    else if (this.selectedbrand_TYPE != "" && this.tmpTypeBaru == "") {
      // console.log(this.tmpTypeBaru);
      console.log("brand sudah terpilih dan tipe belum");

      this.pilihbrandtambahtipe = false;
      this.masukannamatype = true;
    }
    else if(this.selectedbrand_TYPE == "" && this.tmpTypeBaru == "")
    {
      console.log("brand dan tipe belum terpilih");
      this.masukannamatype = true;
      this.pilihbrandtambahtipe = true;
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
              this.selectedbrand_TYPE = "";

              const alert = await this.alertCtrl.create({
                subHeader: 'Tipe berhasil ditambahkan!',
                buttons: ['OK'],
              });

              await alert.present();
              this.masukannamatype = false;
              this.pilihbrandtambahtipe = false;

            }
          }
        ]
      });
      await alert.present();
    }

  }

  async HapusBrand()
  {
    console.log(this.selectedbrand_HAPUS);
    if (this.selectedbrand_HAPUS == "") {
      console.log(this.selectedbrand_HAPUS);
      this.pilihbrand = true;
    }
    else {
      let alert = await this.alertCtrl.create({

        message: 'Anda yakin ingin menghapus brand ini?',
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
              this.dataService.deleteBrand(this.selectedbrand_HAPUS);
              this.selectedbrand_HAPUS = "";
              const alert = await this.alertCtrl.create({
                subHeader: 'Brand berhasil dihapus!',
                buttons: ['OK'],
              });
              await alert.present();
              this.pilihbrand = false;

            }
          }
        ]
      });
      await alert.present();
    }

  }

  async HapusType()
  {
    console.log(this.selectedbrand_HAPUSTYPE);
    console.log(this.selectedtype_HAPUS);

    if(this.selectedbrand_HAPUSTYPE == "" && this.selectedtype_HAPUS != "")
    {
      console.log("brand belum terpilih dan tipe sudah");
      this.pilihbrand_hapustipe = true;
      this.pilihtipe_hapustipe = false;
    }
    else if (this.selectedbrand_HAPUSTYPE != "" && this.selectedtype_HAPUS == "") {
      // console.log(this.tmpTypeBaru);
      console.log("brand sudah terpilih dan tipe belum");

      this.pilihbrand_hapustipe = false;
      this.pilihtipe_hapustipe = true;
    }
    else if(this.selectedbrand_HAPUSTYPE == "" && this.selectedtype_HAPUS == "")
    {
      console.log("brand dan tipe belum terpilih");
      this.pilihbrand_hapustipe = true;
      this.pilihtipe_hapustipe = true;
    }
    else {
      let alert = await this.alertCtrl.create({

        message: 'Anda yakin ingin menghapus tipe ini?',
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
              this.dataService.deleteType(this.selectedbrand_HAPUSTYPE, this.selectedtype_HAPUS);
              this.selectedtype_HAPUS = "";
              this.selectedbrand_HAPUSTYPE = "";

              const alert = await this.alertCtrl.create({
                subHeader: 'Tipe berhasil dihapus!',
                buttons: ['OK'],
              });
              await alert.present();
              this.pilihbrand_hapustipe = false;
              this.pilihtipe_hapustipe = false;

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
    this.pilihbrand = false;
    this.pilihbrandtambahtipe = false;
    this.pilihbrand_hapustipe = false;
    this.pilihtipe_hapustipe = false;
    this.tmpnamabrandbaru = "";
    this.selectedbrand_TYPE = "";
    this.selectedbrand_HAPUS = "";
    this.tmpTypeBaru = "";
    this.selectedtype_HAPUS = "";
    this.selectedbrand_HAPUSTYPE = "";
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
