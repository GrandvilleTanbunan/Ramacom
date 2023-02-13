import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { EdithargaPage } from '../editharga/editharga.page';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../services/data.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-stocklain',
  templateUrl: './stocklain.page.html',
  styleUrls: ['./stocklain.page.scss'],
})
export class StocklainPage implements OnInit {
  tmpKategori = [];
  selectedKategori;
  selectedKategori_TambahItem = "";
  tmpItemBaru = "";
  tmpHargaBaru;
  pilikategoritambahtipe = false;
  masukannamaitem = false;
  masukkanharga = false;
  isSubmitted = false;
  masukkankategori = false;

  namakategoribaru = "";
  ionicForm: FormGroup;

  constructor(private loadingCtrl: LoadingController,private currencyPipe: CurrencyPipe, private toastController: ToastController,private alertCtrl: AlertController,private dataService: DataService, public formBuilder: FormBuilder, private modalCtrl: ModalController, private db: AngularFirestore, ) { }

  ngOnInit() {
    this.getKategori();
    this.ionicForm = this.formBuilder.group({
      kategori: ['', [Validators.required]],
      nama: ['', [Validators.required, Validators.minLength(2)]],
      harga:['', [Validators.required]]
    })
  }

  getKategori()
  {
    this.db.collection('Kategori', ref => ref.orderBy('namakategori'))
      .valueChanges({ idField: 'CategoryID' })
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

  async SaveKategori()
  {
    if(this.namakategoribaru == "")
    {
      this.masukkankategori = true;
    }
    else
    {
      this.masukkankategori = false;
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin menambahkan kategori ${this.namakategoribaru}?`,
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
                const res = await this.db.collection(`Kategori`).add({namakategori : this.namakategoribaru}).then(async ()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    message: 'Kategori berhasil ditambahkan!',
                    duration: 1500,
                    position: 'bottom'
                  });
    
                  await toast.present();

                  this.namakategoribaru = "";
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
      console.log('Please provide all the required values!')
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
              this.dataService.addItem(this.ionicForm.value)

              const toast = await this.toastController.create({
                message: 'Item berhasil ditambahkan!',
                duration: 1500,
                position: 'bottom'
              });

              await toast.present();
              this.ionicForm.reset();


            }
          }
        ]
      });
      await alert.present();
    }

  }

  Dismissmodal()
  {
    console.log("masuk sini")
    this.isSubmitted = false;
    this.ionicForm.reset();
    this.modalCtrl.dismiss();
    this.selectedKategori_TambahItem = "";
    this.tmpItemBaru = "";
    this.tmpHargaBaru = undefined;
    this.namakategoribaru = "";
    this.masukkankategori = false;
  }


}
