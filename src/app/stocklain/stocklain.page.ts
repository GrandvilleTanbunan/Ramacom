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

  CleanSelection()
  {
    this.selectedKategori = "";
    this.tmpitem = [];
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
  }


}
