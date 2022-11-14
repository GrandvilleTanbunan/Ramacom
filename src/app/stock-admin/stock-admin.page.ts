import { Component, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController, ToastController, ModalController  } from '@ionic/angular';
// import { ModalExampleComponent } from './modal-example.component';
import { AddTypeModalComponent } from '../add-type-modal/add-type-modal.component';
import { App } from '@capacitor/app';
import { DataService } from './../services/data.service';
import { collection } from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {of} from 'rxjs'
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-stock-admin',
  templateUrl: './stock-admin.page.html',
  styleUrls: ['./stock-admin.page.scss'],
})


export class StockAdminPage implements OnInit {
  brand: Array<string>;
  tmpbrand = [];
  public tmptype = [];
  tmptypeHAPUS = [];
  tmpcabang = [];
  tmpstock = [];
  tmpstockfinal= [];

  opsitampilkansemua = "0";


  kategori: Array<string>;

  selectedbrand = "";
  selectedbrand_TYPE = "";
  selectedtype = "";
  selectedbrand_HAPUS = "";
  selectedbrand_HAPUSTYPE = "";
  selectedtype_HAPUS = "";

  selectedCabang = "";

  selectedBrandCabang = "";

  masukannamabrand = false;
  masukannamatype = false;
  pilihbrand = false;
  pilihbrandtambahtipe = false;
  pilihtipe_hapustipe = false;
  pilihbrand_hapustipe = false;

  tmpnamabrandbaru = "";
  tmpTypeBaru = "";

  tmplihatstock = "";

  rand = [];
 

  customPopoverOptions = {
    header: 'Pilih Kategori',
  };


  constructor(private db: AngularFirestore, private modalCtrl: ModalController, private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.presentConfirm();
        // App.exitApp();
        
      }
    });

    this.kategori = ["Handphone", "Aksesoris"];

    
  

   }

  ngOnInit() {
    this.getBrand();
    this.getCabang();

  }

  pilihBerdasarkan()
  {
    console.log(this.tmplihatstock);
    this.selectedCabang = "";
    this.selectedbrand = "";
    this.opsitampilkansemua = "0";
    this.tmptype = [];
  }

  pilihtampilkan()
  {
    console.log("Opsi tampilkan semua: ", this.opsitampilkansemua);
    this.selectedBrandCabang = "";
  }

  getCabang()
  {
    this.db.collection('Cabang', ref => ref.orderBy('namacabang'))
        .valueChanges({ idField: 'CabangID' })
        .subscribe( data => {
            this.tmpcabang = data;   
            console.log(this.tmpcabang);
        }
    );
  }

  async getBrand() {

    //INI BENAR JI CUMA MASIH MAU COBA CARA LAIN
    // this.dataService.getBrand().subscribe(res => {
    //   this.tmpbrand = res;
    //   console.log(this.tmpbrand);

    // });

    // this.dataService.getBrand();

    // this.tmpbrand = this.dataService.tmpbrand;

    this.db.collection('Brand', ref => ref.orderBy('namabrand'))
        .valueChanges({ idField: 'BrandID' })
        .subscribe( data => {
            this.tmpbrand = data;   
            console.log(this.tmpbrand);
        }
    );
  }

  
  public getType() {

    // this.dataService.getType(this.selectedbrand);

    // this.db.collection(`Brand/${this.selectedbrand}/Type`, ref => ref.orderBy('type', 'asc'))
    //   .valueChanges({ idField: 'TypeID' })
    //   .take(1)
    //   .subscribe(data => {
    //     this.tmptype = data;
    //     console.log(this.tmptype)
    //     // return of(this.tmptype);
    //     this.getRandomNumber();
    //     this.getstockdicabang();

    //   }

    //   );

      // console.log(this.db.collection(`Brand/${this.selectedbrand}/Type`, ref => ref.orderBy('type', 'asc')).ref.get());

      this.db.collection(`Brand/${this.selectedbrand}/Type`, ref => ref.orderBy('type', 'asc')).valueChanges({ idField: 'TypeID' }).pipe(take(1))
      .subscribe(data => {
        this.tmptype = data;
        console.log(this.tmptype)
        // return of(this.tmptype);
        // this.getRandomNumber();
        this.getstockdicabang();
      });


  }

  public TambahTipeClicked()
  {
    this.selectedbrand = "";
    this.tmptype = [];
  }

  public getstockdicabang()
  {

    this.tmpstock = [];
    this.tmpstockfinal = [];
    console.log(this.tmpcabang);

    for (let i = 0; i < this.tmptype.length; i++) {
      console.log(this.tmptype[i].TypeID);
      this.db.collection(`Brand/${this.selectedbrand}/Type/${this.tmptype[i].TypeID}/stockdicabang`)
        .valueChanges({ idField: 'CabangID' })
        .subscribe(data => {
          this.tmpstock.push(data);
          console.log(this.tmpstock)
          this.stockfinal(this.tmptype[i].type, data)
        }

        );
    }


    
  }

  public stockfinal(type, data)
  {
    this.tmpstockfinal.push({type: type, data})
    console.log(this.tmpstockfinal);
  }

  getRandomNumber(){
    // this.rand = Math.floor(Math.random() * 5);\
    this.rand = [];
    console.log("banyak type = ", this.tmptype.length.toString());
    for(let i=0; i<8; i++)
    {
      this.rand.push(Math.floor(Math.random() * 5));
    }
    console.log("isi random= ",this.rand);
  }

  public optionsBrand_TAMBAHBRAND(): void {
    this.masukannamabrand = false;
    
  }

  public optionsBrandHAPUS(): void {
    this.dataService.getType(this.selectedbrand_HAPUSTYPE).subscribe(res => {
      this.tmptype = res;
      console.log(this.tmptype);
    });

  }

  public optionsBrand_TAMBAHTIPE(): void {
    this.pilihbrandtambahtipe = false;
    
  }

  public optionsTipe_TAMBAHTIPE(): void {
    this.masukannamatype = false;
  }

  public optionsBrand_HAPUSTIPE(): void {
    // this.dataService.getType(this.selectedbrand_HAPUSTYPE).subscribe(res => {
    //   this.tmptype = res;
    //   console.log(this.tmptype);
    // });

    this.db.collection(`Brand/${this.selectedbrand_HAPUSTYPE}/Type`, ref => ref.orderBy('type', 'asc'))
        .valueChanges({idField: 'TypeID'})
        .subscribe( data => {
            this.tmptypeHAPUS = data;
            console.log(this.tmptypeHAPUS)
            // return of(this.tmptype);
        }
        
    );

    this.pilihbrand_hapustipe = false;
  }

  public OptionType_HAPUSTIPE(): void {
    console.log(this.selectedtype_HAPUS);
    this.pilihtipe_hapustipe = false;

  }

  public optionsBrand_HAPUSBRAND(): void {
    this.pilihbrand = false;
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
    // console.log(this.selectedbrand_TYPE);
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
              // this.dataService.addStock(this.selectedbrand_TYPE);
              this.tmpTypeBaru = "";
              // this.selectedbrand_TYPE = "";

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
        subHeader: 'Menghapus brand akan menghapus seluruh tipe',
        message: 'Anda yakin ingin menghapus brand ini?',
        // mode:'ios',
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
              this.selectedbrand = "";
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
              this.selectedtype = "";
              // this.selectedbrand_HAPUSTYPE = "";
              this.tmptypeHAPUS = [];

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

    this.tmptypeHAPUS = [];


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

  

}
