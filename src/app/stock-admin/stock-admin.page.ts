import { Component, OnInit } from '@angular/core';
import { Platform, IonRouterOutlet, AlertController, ToastController, ModalController, LoadingController, NavController   } from '@ionic/angular';
// import { ModalExampleComponent } from './modal-example.component';
import { AddTypeModalComponent } from '../add-type-modal/add-type-modal.component';
import { App } from '@capacitor/app';
import { DataService } from './../services/data.service';
import { collection } from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {of} from 'rxjs'
import { take } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  selectedbrand_TYPE;
  selectedtype = "";
  selectedbrand_HAPUS;
  selectedbrand_HAPUSTYPE;
  selectedtype_HAPUS;

  selectedbrand_PindahkanStock = "";
  selectedtype_PindahkanStock;
  selectedCabang_DARI_PindahkanStock;
  selectedCabang_KE_PindahkanStock;
  arrjumlahdari = [];
  tmpjumlahdari;
  tmpjumlahke;
  jumlahyangdipindahkan = 1;
  
  tmptype_PindahkanStock = [];

  selectedbrand_UpdateStock = "";
  selectedtype_UpdateStock;
  selectedCabang_UpdateStock;
  arrjumlahstock_UpdateStock = [];
  tmptype_UpdateStock = [];
  tmpjumlahstocksaatini;
  tmpjumlahstocksetelahdijumlah;

  selectedCabang = "";

  selectedBrandCabang = "";

  masukannamabrand = false;
  masukannamatype = false;
  masukkanharga = false;
  pilihbrand = false;
  pilihbrandtambahtipe = false;
  pilihtipe_hapustipe = false;
  pilihbrand_hapustipe = false;
  stocktidakcukup = false;
  cabangsama = false;
  stock_DARI_FINAL = 0;
  stock_KE_FINAL = 0;

  tmpnamabrandbaru = "";
  tmpTypeBaru = "";
  tmpHargaBaru: any;
  old_tmpHargaBaru: any;
  tmplihatstock = "";

  rand = [];

  loggeduser;

  tmpupdate_tambah = "UPDATE";
  tmpjumlahupdate_tambah = 1;
  togglevalue_UpdateStock= false;

  tmpusername;
 

  customPopoverOptions = {
    header: 'Pilih Kategori',
  };


  constructor(private toastController: ToastController, private currencyPipe: CurrencyPipe, private navCtrl: NavController, private router: Router, private authService: AuthService, private loadingCtrl: LoadingController, private db: AngularFirestore, private modalCtrl: ModalController, private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        this.presentConfirm();
        // App.exitApp();
        
      }
    });

    // this.kategori = ["Handphone", "Aksesoris"];
   }

  ngOnInit() {
    this.getBrand();
    this.getCabang();
    this.authService.loginStatus$.subscribe(user => {
      this.loggeduser = user;
      console.log("logged user: ", this.loggeduser);
    });
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
        .valueChanges({ idField: 'CabangID' }).pipe(take(1))
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
    
    this.db.collection(`Brand/${this.selectedbrand}/Type`, ref => ref.orderBy('type', 'asc')).valueChanges({ idField: 'TypeID' }).pipe(take(1))
    .subscribe(data => {
      this.tmptype = data;
      console.log(this.tmptype)
      this.getstockdicabang();
    });
    
  }

  public CleanSelection()
  {
    this.selectedbrand = "";
    this.tmptype = [];
    this.selectedbrand_PindahkanStock = "";
    this.selectedtype_PindahkanStock = undefined;
    this.selectedCabang_DARI_PindahkanStock = undefined;
    this.selectedCabang_KE_PindahkanStock = undefined;
    this.arrjumlahdari = [];
    this.tmpjumlahdari = undefined;
    this.tmpjumlahke = undefined;

    console.log("Cliked")

    // console.log(this.selectedtype_PindahkanStock);
  }

  public async getstockdicabang()
  {

    this.tmpstock = [];
    this.tmpstockfinal = [];
    console.log(this.tmpcabang);
    console.log(this.tmptype);

    if(this.tmptype.length == 0)
    {
      let alert = await this.alertCtrl.create({
      
        subHeader: 'Belum ada tipe pada brand ini, silahkan tambahkan tipe pada menu Tambah Tipe!',
        buttons: [
          {
            text: 'OK'
          }
        ]
      });
      await alert.present();
    }
    else
    {
      const loading = await this.loadingCtrl.create({
        message: 'Mohon tunggu...',
      });
  
      loading.present();
  
      for (let i = 0; i < this.tmptype.length; i++) {
        console.log(this.tmptype[i].TypeID);
        this.db.collection(`Brand/${this.selectedbrand}/Type/${this.tmptype[i].TypeID}/stockdicabang`)
          .valueChanges({ idField: 'CabangID' })
          .pipe(take(1))
          .subscribe(data => {
            this.tmpstock.push({ type: this.tmptype[i].type, data });
            // console.log(data);
            // this.tmpstock = [{type: this.tmptype[i].type, data}];
            console.log(this.tmpstock)
  
            // this.stockfinal(this.tmptype[i].type, data)
            loading.dismiss();
          }
  
          );
      }
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

    this.db.collection(`Brand/${this.selectedbrand_HAPUSTYPE.BrandID}/Type`, ref => ref.orderBy('type', 'asc'))
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

  public optionsBrand_PindahkanStock(): void {
    // this.pilihbrand = false;
    this.selectedtype_PindahkanStock = "";
    this.stocktidakcukup = false;
    this.jumlahyangdipindahkan =1;

    this.db.collection(`Brand/${this.selectedbrand_PindahkanStock}/Type`, ref => ref.orderBy('type', 'asc'))
        .valueChanges({idField: 'TypeID'})
        .subscribe( data => {
            this.tmptype_PindahkanStock = data;
            console.log(this.tmptype_PindahkanStock)
            // return of(this.tmptype);
        }
        
    );

    console.log(this.selectedbrand_PindahkanStock)
    console.log(this.selectedtype_PindahkanStock)
  }

  public optionsType_PindahkanStock(): void {
    // this.pilihbrand = false;
    console.log(this.selectedtype_PindahkanStock)
    this.arrjumlahdari = [];
    this.tmpjumlahdari = undefined;
    this.tmpjumlahke = undefined;
    this.selectedCabang_DARI_PindahkanStock = undefined;
    this.selectedCabang_KE_PindahkanStock =undefined;

  }

  public OptionTCabang_DARI_DAN_KE_PindahkanStock(): void {
    // this.pilihbrand = false;
    console.log(this.selectedCabang_DARI_PindahkanStock)
    console.log(this.selectedCabang_KE_PindahkanStock)

    if(this.selectedCabang_DARI_PindahkanStock.CabangID == this.selectedCabang_KE_PindahkanStock.CabangID)
    {
      this.cabangsama = true;
    }
    else
    {
      this.cabangsama = false;

      this.arrjumlahdari = [];
      this.tmpjumlahdari = undefined;
      this.tmpjumlahke = undefined;
  
      this.db.collection(`Brand/${this.selectedbrand_PindahkanStock}/Type/${this.selectedtype_PindahkanStock.TypeID}/stockdicabang`)
          .valueChanges({idField: "namacabang"})
          // .pipe(take(1))
          .subscribe(data => {
            this.arrjumlahdari = data;
            console.log(this.arrjumlahdari);
            for(let i=0; i<this.arrjumlahdari.length; i++)
            {
              if(this.selectedCabang_DARI_PindahkanStock!=undefined && this.selectedCabang_DARI_PindahkanStock.namacabang == this.arrjumlahdari[i].namacabang)
              {
                this.tmpjumlahdari = this.arrjumlahdari[i].jumlah;
                console.log(this.tmpjumlahdari);
              }
  
              if(this.selectedCabang_KE_PindahkanStock !=undefined && this.selectedCabang_KE_PindahkanStock.namacabang == this.arrjumlahdari[i].namacabang)
              {
                this.tmpjumlahke = this.arrjumlahdari[i].jumlah;
                console.log(this.tmpjumlahke);
              }
             
            }
          }
  
          );
    }

    

  }

  
  public optionsBrand_UpdateStock(): void {
    // this.pilihbrand = false;
    this.selectedtype_UpdateStock = "";
    this.selectedCabang_UpdateStock = "";

    this.db.collection(`Brand/${this.selectedbrand_UpdateStock}/Type`, ref => ref.orderBy('type', 'asc'))
        .valueChanges({idField: 'TypeID'})
        .subscribe( data => {
            this.tmptype_UpdateStock = data;
            console.log(this.tmptype_UpdateStock)
            // return of(this.tmptype);
        }
        
    );

    console.log(this.selectedbrand_UpdateStock)
    console.log(this.tmptype_UpdateStock)
  }

  public optionsType_UpdateStock(): void {
    console.log(this.selectedtype_UpdateStock);
    this.selectedCabang_UpdateStock = "";


  }

  public optionCabang_UpdateStock(): void{
    this.db.collection(`Brand/${this.selectedbrand_UpdateStock}/Type/${this.selectedtype_UpdateStock.TypeID}/stockdicabang`)
    .valueChanges({idField: "namacabang"})
    // .pipe(take(1))
    .subscribe(data => {
      this.arrjumlahstock_UpdateStock = data;
      console.log(this.arrjumlahstock_UpdateStock);
      for(let i=0; i<this.arrjumlahstock_UpdateStock.length; i++)
      {
        if(this.selectedCabang_UpdateStock.namacabang == this.arrjumlahstock_UpdateStock[i].namacabang)
        {
          this.tmpjumlahstocksaatini = this.arrjumlahstock_UpdateStock[i].jumlah;
          console.log(this.tmpjumlahstocksaatini);
          this.hitungupdate();
        }
       
      }
    }

    );
  }

  public toggle_UpdateStock(): void{
    console.log(this.togglevalue_UpdateStock);
    if(this.togglevalue_UpdateStock == false)
    {
      this.tmpupdate_tambah = "UPDATE";
    }
    else
    {
      this.tmpupdate_tambah = "TAMBAH";
    }

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

        subHeader: 'Anda yakin ingin menambahkan brand ini?',
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
              this.dataService.addBrand(this.tmpnamabrandbaru, this.loggeduser);
              this.tmpnamabrandbaru = "";
              // const alert = await this.alertCtrl.create({
              //   subHeader: 'Brand berhasil ditambahkan!',
              //   buttons: ['OK'],
              // });
              // await alert.present();

              const toast = await this.toastController.create({
                message: 'Brand berhasil ditambahkan!',
                duration: 1500,
                position: 'bottom'
              });

              await toast.present();


              this.masukannamabrand = false;

            }
          }
        ]
      });
      await alert.present();

    }
    
  }

  currencyCheck(): void 
  {
    
  }

  async SaveType()
  {
    // console.log(this.selectedbrand_TYPE);
    if(this.selectedbrand_TYPE == undefined && this.tmpTypeBaru != "")
    {
      console.log("brand belum terpilih dan tipe sudah");
      this.pilihbrandtambahtipe = true;
      this.masukannamatype = false;
      this.masukkanharga = true;

    }
    else if (this.selectedbrand_TYPE != undefined && this.tmpTypeBaru == "") {
      // console.log(this.tmpTypeBaru);
      console.log("brand sudah terpilih dan tipe belum");

      this.pilihbrandtambahtipe = false;
      this.masukannamatype = true;
      this.masukkanharga = true;

    }
    else if(this.selectedbrand_TYPE == undefined && this.tmpTypeBaru == "")
    {
      console.log("brand dan tipe belum terpilih");
      this.masukannamatype = true;
      this.pilihbrandtambahtipe = true;
      this.masukkanharga = true;

    }
    else if(this.tmpHargaBaru == undefined)
    {
      this.masukannamatype = false;
      this.pilihbrandtambahtipe = false;
      this.masukkanharga = true;
    }
    else {
      const tmpHargaBaru_formatted = this.currencyPipe.transform(this.tmpHargaBaru, 'Rp ', true, '1.0');
      
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin menambahkan tipe ${this.tmpTypeBaru} dengan harga ${tmpHargaBaru_formatted}?`,
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
              if(this.tmpHargaBaru == 0) this.tmpHargaBaru = 0;
              this.dataService.addType(this.loggeduser, this.selectedbrand_TYPE.BrandID, this.selectedbrand_TYPE.namabrand,this.tmpTypeBaru, this.tmpcabang, this.tmpHargaBaru);
              // this.dataService.addStock(this.selectedbrand_TYPE);
              this.tmpTypeBaru = "";
              // this.selectedbrand_TYPE = "";

              // const alert = await this.alertCtrl.create({
              //   subHeader: 'Tipe berhasil ditambahkan!',
              //   buttons: ['OK'],
              // });

              // await alert.present();

              const toast = await this.toastController.create({
                message: 'Tipe berhasil ditambahkan!',
                duration: 1500,
                position: 'bottom'
              });

              await toast.present();
              this.masukannamatype = false;
              this.pilihbrandtambahtipe = false;
              this.masukkanharga = false;

              this.tmpHargaBaru = undefined;

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
              this.dataService.deleteBrand(this.loggeduser, this.selectedbrand_HAPUS.BrandID, this.selectedbrand_HAPUS.namabrand);
              this.selectedbrand_HAPUS = "";
              this.selectedbrand = "";
              // const alert = await this.alertCtrl.create({
              //   subHeader: 'Brand berhasil dihapus!',
              //   buttons: ['OK'],
              // });
              // await alert.present();

              const toast = await this.toastController.create({
                message: 'Brand berhasil dihapus!',
                duration: 1500,
                position: 'bottom'
              });

              await toast.present();


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

    if(this.selectedbrand_HAPUSTYPE == undefined && this.selectedtype_HAPUS != undefined)
    {
      console.log("brand belum terpilih dan tipe sudah");
      this.pilihbrand_hapustipe = true;
      this.pilihtipe_hapustipe = false;
    }
    else if (this.selectedbrand_HAPUSTYPE != undefined && this.selectedtype_HAPUS == undefined) {
      // console.log(this.tmpTypeBaru);
      console.log("brand sudah terpilih dan tipe belum");

      this.pilihbrand_hapustipe = false;
      this.pilihtipe_hapustipe = true;
    }
    else if(this.selectedbrand_HAPUSTYPE == undefined && this.selectedtype_HAPUS == undefined)
    {
      console.log("brand dan tipe belum terpilih");
      this.pilihbrand_hapustipe = true;
      this.pilihtipe_hapustipe = true;
    }
    else {
      let alert = await this.alertCtrl.create({

        subHeader: 'Anda yakin ingin menghapus tipe ini?',
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
              this.dataService.deleteType(this.loggeduser, this.selectedbrand_HAPUSTYPE.namabrand, this.selectedbrand_HAPUSTYPE.BrandID, this.selectedtype_HAPUS.type, this.selectedtype_HAPUS.TypeID, this.tmpcabang);
              this.selectedtype_HAPUS = "";
              this.selectedtype = "";
              // this.selectedbrand_HAPUSTYPE = "";
              this.tmptypeHAPUS = [];

              // const alert = await this.alertCtrl.create({
              //   subHeader: 'Tipe berhasil dihapus!',
              //   buttons: ['OK'],
              // });
              // await alert.present();

              const toast = await this.toastController.create({
                message: 'Tipe berhasil dihapus!',
                duration: 1500,
                position: 'bottom'
              });

              await toast.present();

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
    this.selectedbrand_TYPE = undefined;
    this.selectedbrand_HAPUS = undefined;
    this.tmpTypeBaru = "";
    this.tmpHargaBaru = undefined;
    this.selectedtype_HAPUS = "";
    this.selectedbrand_HAPUSTYPE = "";

    this.selectedbrand_PindahkanStock = undefined;
    this.selectedtype_PindahkanStock = undefined;
    this.selectedCabang_DARI_PindahkanStock = undefined;
    this.selectedCabang_KE_PindahkanStock = undefined;
    this.jumlahyangdipindahkan = 1;
    this.stocktidakcukup = false;

    this.selectedbrand_UpdateStock = undefined;
    this.selectedtype_UpdateStock = undefined;
    this.selectedCabang_UpdateStock = undefined;
    this.masukkanharga = false;
    this.tmpjumlahupdate_tambah = 1;

    console.log(this.selectedtype_PindahkanStock)

    this.tmptypeHAPUS = [];


  }

  async PindahkanStock()
  {
    console.log("dari:",  this.selectedCabang_DARI_PindahkanStock);
    console.log("ke:",  this.selectedCabang_KE_PindahkanStock);

    if(this.tmpjumlahdari < this.jumlahyangdipindahkan)
    {
      this.stocktidakcukup = true;
    }
    else if(this.selectedCabang_DARI_PindahkanStock.CabangID == this.selectedCabang_KE_PindahkanStock.CabangID)
    {
      this.cabangsama = true;
    }
    else{
      console.log(this.jumlahyangdipindahkan);
      this.stocktidakcukup = false;
      this.cabangsama = false;
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin memindahkan ${this.jumlahyangdipindahkan} unit '${this.selectedtype_PindahkanStock.type}' dari ${this.selectedCabang_DARI_PindahkanStock.namacabang} ke ${this.selectedCabang_KE_PindahkanStock.namacabang}?`,
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
              this.prosespindahkan();
            }
          }
        ]
      });
      await alert.present();
    }
  }

  public async prosespindahkan()
  {
    const loading = await this.loadingCtrl.create({
      message: 'Mohon tunggu...',
    });

    loading.present();
    
    this.stock_DARI_FINAL = this.tmpjumlahdari - this.jumlahyangdipindahkan;
    this.stock_KE_FINAL = (parseInt(this.tmpjumlahke) + parseInt(this.jumlahyangdipindahkan.toString()));
    // console.log("Stock dari: ",this.stock_DARI_FINAL);
    // console.log("Stock ke: ",this.stock_KE_FINAL);

    const pindahkandari = this.db.collection(`Brand/${this.selectedbrand_PindahkanStock}/Type/${this.selectedtype_PindahkanStock.TypeID}/stockdicabang`).doc(this.selectedCabang_DARI_PindahkanStock.namacabang);
    
    const pindahkanke = this.db.collection(`Brand/${this.selectedbrand_PindahkanStock}/Type/${this.selectedtype_PindahkanStock.TypeID}/stockdicabang`).doc(this.selectedCabang_KE_PindahkanStock.namacabang);
    
    const res1 = await pindahkandari.update({jumlah: this.stock_DARI_FINAL});
    const res2 = await pindahkanke.update({jumlah: this.stock_KE_FINAL});

    this.dataService.addnotif(`${this.loggeduser} memindahkan stock '${this.selectedtype_PindahkanStock.type}' sebanyak ${this.jumlahyangdipindahkan} unit dari ${this.selectedCabang_DARI_PindahkanStock.namacabang} ke ${this.selectedCabang_KE_PindahkanStock.namacabang}`)

    // const alert = await this.alertCtrl.create({
    //   subHeader: 'Stock berhasil dipindahkan!',
    //   buttons: ['OK'],
    // });

    const toast = await this.toastController.create({
      message: 'Stock berhasil dipindahkan!',
      duration: 1500,
      position: 'bottom'
    });
    loading.dismiss();
    await toast.present();

    // await alert.present();
  }


   async presentConfirm() {
    let alert = await this.alertCtrl.create({
      
      subHeader: 'Anda yakin ingin keluar aplikasi?',
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

  increment () {
    if(this.jumlahyangdipindahkan >= 999) this.jumlahyangdipindahkan = 999;
    else this.jumlahyangdipindahkan++;
    
  }
  
  decrement () {
    if(this.jumlahyangdipindahkan<=1) this.jumlahyangdipindahkan = 1;
    else this.jumlahyangdipindahkan--;
  }

  increment_Tambah () {
    
    if(this.tmpjumlahupdate_tambah >= 999) this.tmpjumlahupdate_tambah = 999;
    else{
      this.tmpjumlahupdate_tambah++;
      this.hitungupdate();
    }
    
  }
  
  decrement_Tambah() {
    
    if (this.tmpjumlahupdate_tambah <= 1) this.tmpjumlahupdate_tambah = 1;
    else 
    {
      this.tmpjumlahupdate_tambah--;
      this.hitungupdate();
    }
  
  }

  hitungupdate()
  {
    console.log("Hitung")
    this.tmpjumlahstocksetelahdijumlah = parseInt(this.tmpjumlahupdate_tambah.toString())+parseInt(this.tmpjumlahstocksaatini.toString());
  }

  public async UpdateStock(): Promise<void>{

    if(this.togglevalue_UpdateStock == true)
    {
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin mengupdate jumlah '${this.selectedtype_UpdateStock.type}' pada ${this.selectedCabang_UpdateStock.namacabang} menjadi ${this.tmpjumlahstocksetelahdijumlah} unit?`,
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
              const loading = await this.loadingCtrl.create({
                message: 'Mohon tunggu...',
              });
          
              loading.present();
              console.log("Stock akan menjadi: ", this.tmpjumlahstocksetelahdijumlah);
              console.log(this.selectedCabang_UpdateStock);
              this.dataService.addnotif(`${this.loggeduser} menambah stock '${this.selectedtype_UpdateStock.type}' pada ${this.selectedCabang_UpdateStock.namacabang} menjadi ${this.tmpjumlahstocksetelahdijumlah} unit`)
        
              const update = this.db.collection(`Brand/${this.selectedbrand_UpdateStock}/Type/${this.selectedtype_UpdateStock.TypeID}/stockdicabang`).doc(this.selectedCabang_UpdateStock.namacabang);
              
              const res1 = await update.update({jumlah: this.tmpjumlahstocksetelahdijumlah});
        
              // const alert = await this.alertCtrl.create({
              //   subHeader: 'Stock berhasil ditambah!',
              //   buttons: ['OK'],
              // });
              // loading.dismiss();
              const toast = await this.toastController.create({
                message: 'Stock berhasil ditambah!',
                duration: 1500,
                position: 'bottom'
              });

              loading.dismiss();



              await toast.present();
              await alert.present();
            }
          }
        ]
      });
      await alert.present();

     
    }
    else
    {

      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin mengupdate jumlah '${this.selectedtype_UpdateStock.type}' pada ${this.selectedCabang_UpdateStock.namacabang} menjadi ${this.tmpjumlahupdate_tambah} unit?`,
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
              const loading = await this.loadingCtrl.create({
                message: 'Mohon tunggu...',
              });
              console.log("Stock akan menjadi: ", this.tmpjumlahupdate_tambah);
              console.log(this.selectedCabang_UpdateStock);
              this.dataService.addnotif(`${this.loggeduser} mengupdate stock '${this.selectedtype_UpdateStock.type}' pada ${this.selectedCabang_UpdateStock.namacabang} menjadi ${this.tmpjumlahupdate_tambah} unit`)

        
              const update = this.db.collection(`Brand/${this.selectedbrand_UpdateStock}/Type/${this.selectedtype_UpdateStock.TypeID}/stockdicabang`).doc(this.selectedCabang_UpdateStock.namacabang);
              
              const res1 = await update.update({jumlah: this.tmpjumlahupdate_tambah});
        
              // const alert = await this.alertCtrl.create({
              //   subHeader: 'Stock berhasil diupdate!',
              //   buttons: ['OK'],
              // });

              const toast = await this.toastController.create({
                message: 'Stock berhasil diupdate!',
                duration: 1500,
                position: 'bottom'
              });
              
              loading.dismiss();

              await toast.present();
              // await alert.present();
            }
          }
        ]
      });
      await alert.present();

      
    }
  }

  async logout()
  {
    await this.authService.logout();
    // this.router.navigateByUrl('/', {replaceUrl:true});
    this.navCtrl.navigateRoot('/', {replaceUrl: true});
  }

 

}


