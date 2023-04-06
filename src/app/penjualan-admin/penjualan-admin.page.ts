import { Component, OnInit } from '@angular/core';
// import { format, parseISO } from 'date-fns';
import * as moment from 'moment';
import { Platform, IonRouterOutlet, AlertController, ToastController, ModalController, LoadingController   } from '@ionic/angular';
// import { ModalExampleComponent } from './modal-example.component';
import { AddTypeModalComponent } from '../add-type-modal/add-type-modal.component';
import { App } from '@capacitor/app';
import { DataService } from './../services/data.service';
import { collection } from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {of} from 'rxjs'
import { take } from 'rxjs/operators';
import { TransaksiComponentComponent } from '../transaksi-component/transaksi-component.component';
import { DetailtransaksiPage } from '../detailtransaksi/detailtransaksi.page';




@Component({
  selector: 'app-penjualan-admin',
  templateUrl: './penjualan-admin.page.html',
  styleUrls: ['./penjualan-admin.page.scss'],
})
export class PenjualanAdminPage implements OnInit {

  public tmpselectedDate = new Date().toISOString();
  public selectedDate;
  public transaksi = [];
  public tmpfilter;
  transaksihariini = [];
  filter =  "Hari Ini";
  keteranganwaktu;
  constructor(private loadingCtrl: LoadingController, private db: AngularFirestore, private modalCtrl: ModalController, private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    
   }

  ngOnInit() {
    moment.locale('id');
    this.getPenjualanHariini();
  }

  public PilihTanggal(): void {
    this.selectedDate = moment(this.tmpselectedDate).format('DD/MM/YYYY')
    console.log(this.selectedDate);
    
  }

  async OpenModalTransaksi()
  {
    const modal = await this.modalCtrl.create({
      component: TransaksiComponentComponent,
      cssClass:'large-modal',
      componentProps: {
        // detailitem: item,
        // IDBrand: this.selectedbrand,
        // kategori: this.selectedKategori
      },
    });
    await modal.present();
  }

  getPenjualanHariini()
  {
    // const formateddate = moment().format('L');
    this.keteranganwaktu = moment().format('L');
      this.db.collection('Transaksi', ref => ref.where('tanggal', '==', `${this.keteranganwaktu}`))
        .valueChanges()
        .subscribe( data => {
            this.transaksi = data;
            this.transaksi = this.transaksi.reverse();
            console.log(this.transaksihariini);
        });
  }

  setFilter(filter: string)
  {
    this.filter = filter;
    
    this.transaksi = [];
    moment().locale("id");
    // console.log("Bulan & tahun sekarang: "+this.bulandantahunsekarang);
    this.tmpfilter = filter;
    if(this.tmpfilter == "Hari Ini")
    {
      this.keteranganwaktu = moment().format('L');
      this.getPenjualanHariini();
    }
  }

  async pilihtransaksi(item)
  {
    // console.log(item);
    let modal = await this.modalCtrl.create({
      component: DetailtransaksiPage,
      componentProps: {
        item: item,
        keteranganwaktu: this.keteranganwaktu
      },
      cssClass: 'cart-modal'
    });
    modal.present();
  }

  Dismissmodal()
  {
    this.modalCtrl.dismiss();

  }

}
