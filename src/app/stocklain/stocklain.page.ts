import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { EdithargaPage } from '../editharga/editharga.page';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../services/data.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { take, takeWhile, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { getDatabase, ref, child, get, onValue  } from "firebase/database";
import { collectionData, collection, addDoc, Firestore } from '@angular/fire/firestore';
import { Observable, Subscription, Subject } from 'rxjs';
// const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
import * as firebase from 'firebase/app';
export interface Note {
  id?: string;
  title: string;
  text: string;
}

@Component({
  selector: 'app-stocklain',
  templateUrl: './stocklain.page.html',
  styleUrls: ['./stocklain.page.scss'],
})
export class StocklainPage implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  tmpKategori = [];
  tmpcabang = [];
  tmpstock = [];
  selectedKategori = "";
  selectedkategori_HAPUS = "";
  selectedKategori_TambahItem = "";
  public progress = 0;
  tmpItemBaru = "";
  tmpitem = [];
  tmpHargaBaru;
  pilikategoritambahtipe = false;
  masukannamaitem = false;
  masukkanharga = false;
  isSubmitted = false;
  isSubmitted2 = false;
  unsubscribe : any;
  private subscription: Subscription;

  masukkankategori = false;

  namakategoribaru = "";
  ionicForm: FormGroup;
  ionicForm2: FormGroup;
  ionicFormHapusKategori: FormGroup;

  loggeduser;

  showLoader = false;

  selectedkategori_HAPUSITEM;
  selecteditem_HAPUSITEM;
  tmpitemHAPUS = [];
  pilihkategori_HAPUSITEM = false;
  pilihitem_HAPUSITEM = false;

  togglevalue_UpdateStock= false;


  selectedkategori_UpdateStock;
  selecteditem_UpdateStock;
  tmpitemUPDATE = [];
  arrjumlahstock_UpdateStock = [];
  selectedCabang_UpdateStock;
  tmpjumlahstocksaatini;
  tmpjumlahstocksetelahdijumlah;
  tmpjumlahupdate_tambah = 1;
  jumlahyangdipindahkan = 1;

  tmpupdate_tambah = "UPDATE";

  selectedKategori_PindahkanStock;
  selectedItem_PindahkanStock;
  stocktidakcukup = false
  tmpItem_PindahkanStock = [];
  selectedCabang_DARI_PindahkanStock;
  selectedCabang_KE_PindahkanStock;
  cabangsama = false;
  arrjumlahdari = [];
  tmpjumlahdari;
  tmpjumlahke;
  stock_DARI_FINAL = 0;
  stock_KE_FINAL = 0;
  // tmpstock: { nama: string; data: [] }[];

  constructor(private authService: AuthService, private loadingCtrl: LoadingController,private currencyPipe: CurrencyPipe, private toastController: ToastController,private alertCtrl: AlertController,private dataService: DataService, public formBuilder: FormBuilder, private modalCtrl: ModalController, private db: AngularFirestore, ) {

   }

  ngOnInit() {
    this.authService.loginStatus$.subscribe(user => {
      this.loggeduser = user;
      console.log("logged user: ", this.loggeduser);
    });
    this.getKategori();
    this.getCabang();

    this.ionicForm = this.formBuilder.group({
      kategori: ['', [Validators.required]],
      nama: ['', [Validators.required, Validators.minLength(2)]],
      harga:['', [Validators.required]]
    })

    this.ionicForm2 = this.formBuilder.group({
      nama: ['', [Validators.required, Validators.minLength(2)]]
    })

    this.ionicFormHapusKategori = this.formBuilder.group({
      namakategori: ['', [Validators.required]]
    })
    
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


  getKategori()
  {
    this.db.collection('Kategori', ref => ref.orderBy('namakategori'))
      .valueChanges({ idField: 'CategoryID' })
      .pipe(take(1))
      .subscribe(data => {
        this.tmpKategori = data;
        console.log(this.tmpKategori);
        //hapus Handphone
        this.tmpKategori.forEach((element, index) => {
          if (element.namakategori == "Handphone") this.tmpKategori.splice(index, 1);
        });
      }
      );
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  get errorControl2() {
    return this.ionicForm2.controls;
  }

  get errorControlHapusKategori() {
    return this.ionicFormHapusKategori.controls;
  }


  async SaveKategori()
  {
    this.isSubmitted2 = true;
    if(!this.ionicForm2.valid)
    {
      console.log('Please provide all the required values!')

      return false;

    }
    else
    {
      console.log(this.ionicForm2.value.nama);

      // this.masukkankategori = false;
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin menambahkan kategori ${this.ionicForm2.value.nama}?`,
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
              loading.present().then(async () => {
                const res = await this.db.collection(`Kategori`).add({namakategori : this.ionicForm2.value.nama}).then(async ()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    message: 'Kategori berhasil ditambahkan!',
                    duration: 1500,
                    position: 'bottom'
                  });
                  this.isSubmitted2 = false;
    
                  await toast.present();
                  this.ionicForm2.reset();
                  this.getKategori();

                  // this.namakategoribaru = "";
                });
              });
              
              


            }
          }
        ]
      });
      await alert.present();
    }
  }

  async SaveItem()
  {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      console.log(this.ionicForm.value)
      const tmpHargaBaru_formatted = this.currencyPipe.transform(this.ionicForm.value.harga, 'Rp ', true, '1.0');
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin menambahkan ${this.ionicForm.value.nama} dengan harga ${tmpHargaBaru_formatted}?`,
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
              loading.present().then(async () => {
                this.dataService.addItem(this.ionicForm.value, this.tmpcabang, this.ionicForm.value.kategori).then(async ()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    message: 'Item berhasil ditambahkan!',
                    duration: 1500,
                    position: 'bottom'
                  });
                  this.isSubmitted = false;
    
                  await toast.present();
                  this.ionicForm.reset();
                });

                
              });
              


            }
          }
        ]
      });
      await alert.present();
    }

  }

  getType()
  {
    this.tmpitem = [];
    console.log(this.selectedKategori);
    this.db.collection(`${this.selectedKategori}`, ref => ref.orderBy('nama', 'asc'))
        .valueChanges({ idField: 'TypeID' }).pipe(take(1))
        .subscribe( data => {
            this.tmpitem = data;
            console.log(this.tmpitem)
            this.showLoader = true;
            // return of(this.tmptype);
            this.getstockdicabang(this.tmpitem);
        }
        
    );
  }

  public async getstockdicabang(tmpitem)
  {
    this.progress = 0;
    this.tmpstock.length = 0;
    // this.tmpstockfinal = [];
    // console.log(this.tmpcabang);
    console.log(this.tmpitem);

    if(this.tmpitem.length == 0)
    {
      let alert = await this.alertCtrl.create({
      
        subHeader: 'Belum ada item pada kategori ini, silahkan tambahkan item pada menu Tambah Item!',
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
      // this.tmpstock = [];
      const loading = await this.loadingCtrl.create({
        message: 'Mohon tunggu...',
      });
      
      for (let i = 0; i < tmpitem.length; i++) {
        console.log(tmpitem[i].TypeID);
        this.db.collection(`${this.selectedKategori}/${tmpitem[i].TypeID}/stockdicabang`)
          .valueChanges({ idField: 'CabangID' })
          // .pipe(takeUntil(this.ngUnsubscribe))
          .pipe(take(1))

          .subscribe(data => {
            console.log(data)
            if(data.length > 1)
            {
              this.tmpstock.push({ nama: tmpitem[i].nama, data });
              this.showLoader = false;
            }
            
            // loading.dismiss();
          });
        console.log(this.tmpstock) 
      }
    }
    // this.subscription.unsubscribe();


    
  }

  ngOnDestroy() {
    // this.unsubscribe.unsubscribe();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    // this.subscription.unsubscribe();
    // this.tmpstock = [];
  }

  ionViewDidLeave(){
    // this.subscription.unsubscribe();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    }


  async HapusKategori()
  {
    this.isSubmitted = true;
    if (!this.ionicFormHapusKategori.valid) {
      console.log('Please provide all the required values!')
      return false;
    }
    else
    {
      this.isSubmitted = false;
      console.log(this.ionicFormHapusKategori.value.namakategori);
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin menghapus kategori ${this.ionicFormHapusKategori.value.namakategori.namakategori}?`,
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
              loading.present().then(async () => {
                this.dataService.HapusKategori(this.ionicFormHapusKategori.value.namakategori).then(async ()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    message: 'Kategori berhasil dihapus!',
                    duration: 1500,
                    position: 'bottom'
                  });
                  this.isSubmitted = false;
                  
                  await toast.present();
                  this.ionicFormHapusKategori.reset();
                  this.getKategori();

                });

                
              });
              


            }
          }
        ]
      });
      await alert.present();

    }
  }

  optionsKategori_HAPUSITEM() {
    console.log(this.selectedkategori_HAPUSITEM);
    this.tmpitemHAPUS = [];
    this.selecteditem_HAPUSITEM  = undefined;
    this.db.collection(`${this.selectedkategori_HAPUSITEM}`)
      .valueChanges({ idField: 'ItemID' }).pipe(take(1))
      .subscribe(data => {
        this.tmpitemHAPUS = data;
        console.log(this.tmpitemHAPUS)
        // return of(this.tmptype);
      });
      this.pilihkategori_HAPUSITEM = false;
  }
  OptionItem_HAPUSITEM()
  {
    console.log(this.selecteditem_HAPUSITEM)
    this.pilihitem_HAPUSITEM = false;
  }

  async HapusItem()
  {
    console.log(this.selectedkategori_HAPUSITEM);
    console.log(this.selecteditem_HAPUSITEM);
    if(this.selectedkategori_HAPUSITEM == "") this.selectedkategori_HAPUSITEM = undefined;
    if(this.selecteditem_HAPUSITEM == "") this.selecteditem_HAPUSITEM = undefined;


    if(this.selectedkategori_HAPUSITEM == undefined && this.selecteditem_HAPUSITEM != undefined)
    {
      console.log("brand belum terpilih dan tipe sudah");
      this.pilihkategori_HAPUSITEM = true;
      this.pilihitem_HAPUSITEM = false;
    }
    else if (this.selectedkategori_HAPUSITEM != undefined && this.selecteditem_HAPUSITEM == undefined) {
      // console.log(this.tmpTypeBaru);
      console.log("brand sudah terpilih dan tipe belum");

      this.pilihkategori_HAPUSITEM = false;
      this.pilihitem_HAPUSITEM = true;
    }
    else if(this.selectedkategori_HAPUSITEM == undefined && this.selecteditem_HAPUSITEM == undefined)
    {
      console.log("brand dan tipe belum terpilih");
      this.pilihkategori_HAPUSITEM = true;
      this.pilihitem_HAPUSITEM = true;
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
              this.dataService.deleteItem(this.selectedkategori_HAPUSITEM, this.selecteditem_HAPUSITEM.ItemID, this.tmpcabang);
              this.CleanSelection();

              const toast = await this.toastController.create({
                message: 'Item berhasil dihapus!',
                duration: 1500,
                position: 'bottom'
              });

              await toast.present();

              this.pilihkategori_HAPUSITEM = false;
              this.pilihitem_HAPUSITEM = false;

            }
          }
        ]
      });
      await alert.present();
    }
  }

  optionsKategori_UpdateStock()
  {
    console.log(this.selectedkategori_UpdateStock)
    // console.log(this.selectedkategori_HAPUSITEM);
    // this.tmpitemHAPUS = [];
    // this.selecteditem_HAPUSITEM  = undefined;
    this.db.collection(`${this.selectedkategori_UpdateStock}`)
      .valueChanges({ idField: 'ItemID' }).pipe(take(1))
      .subscribe(data => {
        this.tmpitemUPDATE = data;
        console.log(this.tmpitemUPDATE)
        // return of(this.tmptype);
      });
      this.selecteditem_UpdateStock = "";
      this.selectedCabang_UpdateStock = "";
  }

  optionsItem_UpdateStock()
  {
    this.selectedCabang_UpdateStock = "";
    console.log(this.selecteditem_UpdateStock)
  }

  public optionCabang_UpdateStock(): void{
    this.db.collection(`${this.selectedkategori_UpdateStock}/${this.selecteditem_UpdateStock.ItemID}/stockdicabang`)
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
    });
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

  public async UpdateStock(): Promise<void>{

    if(this.togglevalue_UpdateStock == true)
    {
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin menambah jumlah '${this.selecteditem_UpdateStock.nama}' pada ${this.selectedCabang_UpdateStock.namacabang} menjadi ${this.tmpjumlahstocksetelahdijumlah} unit?`,
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
          
              loading.present().then(async ()=>{
                console.log("Stock akan menjadi: ", this.tmpjumlahstocksetelahdijumlah);
                console.log(this.selectedCabang_UpdateStock);
                this.dataService.addnotif(`${this.loggeduser} menambah stock '${this.selecteditem_UpdateStock.nama}' pada ${this.selectedCabang_UpdateStock.namacabang} menjadi ${this.tmpjumlahstocksetelahdijumlah} unit`)
          
                const update = this.db.collection(`${this.selectedkategori_UpdateStock}/${this.selecteditem_UpdateStock.ItemID}/stockdicabang`).doc(this.selectedCabang_UpdateStock.namacabang);
                
                const res1 = await update.update({jumlah: this.tmpjumlahstocksetelahdijumlah}).then(async ()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    message: 'Stock berhasil ditambah!',
                    duration: 1500,
                    position: 'bottom'
                  });
    
                  await toast.present();
                });
  
                
              });
              
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

        subHeader: `Anda yakin ingin mengupdate jumlah '${this.selecteditem_UpdateStock.nama}' pada ${this.selectedCabang_UpdateStock.namacabang} menjadi ${this.tmpjumlahupdate_tambah} unit?`,
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
              loading.present().then(async ()=>{
                console.log("Stock akan menjadi: ", this.tmpjumlahupdate_tambah);
                console.log(this.selectedCabang_UpdateStock);
                this.dataService.addnotif(`${this.loggeduser} mengupdate stock '${this.selecteditem_UpdateStock.nama}' pada ${this.selectedCabang_UpdateStock.namacabang} menjadi ${this.tmpjumlahupdate_tambah} unit`)
  
          
                const update = this.db.collection(`${this.selectedkategori_UpdateStock}/${this.selecteditem_UpdateStock.ItemID}/stockdicabang`).doc(this.selectedCabang_UpdateStock.namacabang);
                
                const res1 = await update.update({jumlah: this.tmpjumlahupdate_tambah}).then(async ()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    message: 'Stock berhasil diupdate!',
                    duration: 1500,
                    position: 'bottom'
                  });
                  
    
                  await toast.present();
                });
          
                
              });
              
              // await alert.present();
            }
          }
        ]
      });
      await alert.present();

      
    }
  }

  public optionsKategori_PindahkanStock(): void {
    // this.pilihbrand = false;
    this.selectedItem_PindahkanStock = "";
    this.stocktidakcukup = false;
    this.jumlahyangdipindahkan =1;
    console.log(this.selectedKategori_PindahkanStock)

    this.db.collection(`${this.selectedKategori_PindahkanStock}`)
        .valueChanges({idField: 'ItemID'}).pipe(take(1))
        .subscribe( data => {
            this.tmpItem_PindahkanStock = data;
            console.log(this.tmpItem_PindahkanStock)
            // return of(this.tmptype);
        }
        
    );
  }

  optionsItem_PindahkanStock()
  {
    console.log(this.selectedItem_PindahkanStock)
    this.selectedCabang_DARI_PindahkanStock = undefined;
    this.selectedCabang_KE_PindahkanStock = undefined;

    this.arrjumlahdari = [];
    this.tmpjumlahdari = undefined;
    this.tmpjumlahke = undefined;
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
  
      this.db.collection(`${this.selectedKategori_PindahkanStock}/${this.selectedItem_PindahkanStock.ItemID}/stockdicabang`)
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

        subHeader: `Anda yakin ingin memindahkan ${this.jumlahyangdipindahkan} unit '${this.selectedItem_PindahkanStock.nama}' dari ${this.selectedCabang_DARI_PindahkanStock.namacabang} ke ${this.selectedCabang_KE_PindahkanStock.namacabang}?`,
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

    loading.present().then(async ()=>{
      this.stock_DARI_FINAL = this.tmpjumlahdari - this.jumlahyangdipindahkan;
      this.stock_KE_FINAL = (parseInt(this.tmpjumlahke) + parseInt(this.jumlahyangdipindahkan.toString()));
      // console.log("Stock dari: ",this.stock_DARI_FINAL);
      // console.log("Stock ke: ",this.stock_KE_FINAL);
  
      const pindahkandari = this.db.collection(`${this.selectedKategori_PindahkanStock}/${this.selectedItem_PindahkanStock.ItemID}/stockdicabang`).doc(this.selectedCabang_DARI_PindahkanStock.namacabang);
      
      const pindahkanke = this.db.collection(`${this.selectedKategori_PindahkanStock}/${this.selectedItem_PindahkanStock.ItemID}/stockdicabang`).doc(this.selectedCabang_KE_PindahkanStock.namacabang);
      
      const res1 = await pindahkandari.update({jumlah: this.stock_DARI_FINAL});
      const res2 = await pindahkanke.update({jumlah: this.stock_KE_FINAL});
  
      this.dataService.addnotif(`${this.loggeduser} memindahkan stock '${this.selectedItem_PindahkanStock.nama}' sebanyak ${this.jumlahyangdipindahkan} unit dari ${this.selectedCabang_DARI_PindahkanStock.namacabang} ke ${this.selectedCabang_KE_PindahkanStock.namacabang}`)
  
      // const alert = await this.alertCtrl.create({
      //   subHeader: 'Stock berhasil dipindahkan!',
      //   buttons: ['OK'],
      // });
      loading.dismiss();
  
      const toast = await this.toastController.create({
        message: 'Stock berhasil dipindahkan!',
        duration: 1500,
        position: 'bottom'
      });
      await toast.present();
    });
    
    

    // await alert.present();
  }

  CleanSelection()
  {
    this.selectedKategori = "";
    this.tmpitem = [];
    this.tmpitemHAPUS = [];
    this.selecteditem_HAPUSITEM  = "";
    this.selectedkategori_HAPUSITEM = "";
    this.pilihkategori_HAPUSITEM = false;
    this.pilihitem_HAPUSITEM = false;

    this.selecteditem_UpdateStock = undefined;
    this.selectedkategori_UpdateStock = undefined;
    this.tmpitemUPDATE = [];
    this.tmpjumlahupdate_tambah = 1;
    this.jumlahyangdipindahkan = 1;

    this.selectedKategori_PindahkanStock = undefined;
    this.selectedItem_PindahkanStock= undefined;
    this.stocktidakcukup = false
    this.tmpItem_PindahkanStock = [];
    this.selectedCabang_DARI_PindahkanStock= undefined;
    this.selectedCabang_KE_PindahkanStock= undefined;
    this.cabangsama = false;
    this.arrjumlahdari = [];
    this.tmpjumlahdari= undefined;
    this.tmpjumlahke= undefined;
    this.stock_DARI_FINAL = 0;
    this.stock_KE_FINAL = 0;

  }

  Dismissmodal()
  {
    console.log("masuk sini")
    this.isSubmitted = false;
    this.isSubmitted2 = false;

    this.ionicForm.reset();
    this.ionicForm2.reset();
    this.ionicFormHapusKategori.reset();


    this.modalCtrl.dismiss();
    this.selectedKategori_TambahItem = "";
    this.tmpItemBaru = "";
    this.tmpHargaBaru = undefined;
    this.namakategoribaru = "";
    this.masukkankategori = false;
    this.tmpjumlahupdate_tambah = 1;
    this.jumlahyangdipindahkan = 1;
  }


}
