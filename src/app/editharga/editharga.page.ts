import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController, ModalController, AlertController, ToastController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-editharga',
  templateUrl: './editharga.page.html',
  styleUrls: ['./editharga.page.scss'],
})
export class EdithargaPage implements OnInit {
  detailitem;
  kategori;
  hargabaru;
  IDBrand;
  hargabaru_formated;
  errorharga = false;
  ionicForm: FormGroup;
  isSubmitted = false;



  constructor(private toastController: ToastController,public formBuilder: FormBuilder, private currencyPipe: CurrencyPipe, private alertCtrl: AlertController, private navCtrl :NavController, private modalCtrl: ModalController, private dataService: DataService) { }

  ngOnInit() {
    console.log(this.detailitem);
    console.log(this.kategori);
    console.log(this.IDBrand);
    this.ionicForm = this.formBuilder.group({
      harga:['', [Validators.required]]
    })
  }

  Dismissmodal()
  {
    this.modalCtrl.dismiss();
  }

  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'Rp ', true, '1.0');
  }

  async EditHarga() {
    this.hargabaru_formated = this.getCurrency(this.hargabaru);
    console.log(this.hargabaru_formated)
    if (this.hargabaru != null) {
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin mengubah harga ${this.detailitem.nama} menjadi ${this.hargabaru_formated}?`,
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
              this.dataService.EditHarga(this.detailitem, this.hargabaru, this.kategori);

              // const alert = await this.alertCtrl.create({
              //   subHeader: 'Harga berhasil diedit!',
              //   buttons: ['OK'],
              // });
              // await alert.present();

              const toast = await this.toastController.create({
                message: 'Harga berhasil diedit!',
                duration: 1500,
                position: 'bottom'
              });
              await toast.present();

              this.modalCtrl.dismiss();
            }
          }
        ]
      });
      await alert.present();
    }
    else {
      this.errorharga = true;
    }

  }

  async EditHargaHp() {
    this.hargabaru_formated = this.getCurrency(this.hargabaru);
    console.log(this.hargabaru_formated)
    if (this.hargabaru != null) {
      let alert = await this.alertCtrl.create({

        subHeader: `Anda yakin ingin mengubah harga ${this.detailitem.type} menjadi ${this.hargabaru_formated}?`,
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
              this.dataService.EditHargaHp(this.IDBrand, this.hargabaru, this.kategori, this.detailitem);

              // const alert = await this.alertCtrl.create({
              //   subHeader: 'Harga berhasil diedit!',
              //   buttons: ['OK'],
              // });
              // await alert.present();

              const toast = await this.toastController.create({
                message: 'Harga berhasil diedit!',
                duration: 1500,
                position: 'bottom'
              });
              await toast.present();


              this.modalCtrl.dismiss();
            }
          }
        ],
      });
      await alert.present();
    }
    else {
      this.errorharga = true;

    }
  }
}
