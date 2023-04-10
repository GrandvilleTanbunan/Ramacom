import { Component, OnInit } from '@angular/core';
// import { format, parseISO } from 'date-fns';
import * as moment from 'moment';
import { Platform, IonRouterOutlet, AlertController, ToastController, ModalController, LoadingController   } from '@ionic/angular';
// import { ModalExampleComponent } from './modal-example.component';
import { AddTypeModalComponent } from '../add-type-modal/add-type-modal.component';
import { App } from '@capacitor/app';
import { DataService } from './../services/data.service';
import { collection, where } from '@firebase/firestore';
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
  tanggalhariini;
  keteranganwaktu;
  keteranganwaktubulan;
  keteranganwaktutahun;
  public tmpselectedRentangTanggal = new Date().toISOString();


  constructor(private loadingCtrl: LoadingController, private db: AngularFirestore, private modalCtrl: ModalController, private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    
   }

  ngOnInit() {
    moment.locale('id');
    this.tanggalhariini = moment().format("L");
    this.getPenjualanHariini();
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

  getPenjualanHariini() {
    // const formateddate = moment().format('L');
    this.keteranganwaktu = moment().format('L');
    this.db.collection('Transaksi', ref => ref.where('tanggal', '==', `${this.keteranganwaktu}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
        console.log(this.transaksihariini);
      });
  }

  getPenjualanBulanIni() {
    this.keteranganwaktu = moment(this.tanggalhariini, "DD/MM/YYYY").format('MMMM YYYY');    
    this.db.collection('Transaksi', ref => ref.where('bulan', '==', `${this.keteranganwaktubulan}`).where('tahun', '==', `${this.keteranganwaktutahun}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
      });
  }
  getPenjualanTahunIni()
  {
    this.keteranganwaktu = moment(this.tanggalhariini, "DD/MM/YYYY").format('YYYY');    
    this.db.collection('Transaksi', ref => ref.where('tahun', '==', `${this.keteranganwaktutahun}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
      });
  }

  public PilihTanggal(): void {
    this.selectedDate = moment(this.tmpselectedDate).format('DD/MM/YYYY');
    this.keteranganwaktu = this.selectedDate;
    this.filter = "Tanggal";
    console.log(this.selectedDate);

    this.db.collection('Transaksi', ref => ref.where('tanggal', '==', `${this.selectedDate}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
        console.log(this.transaksihariini);
      });
  }

  public PilihRentangTanggal(): void {
    // this.notiffinal = [];
    const formateddate = [];
    this.transaksi = [];
    if (this.tmpselectedRentangTanggal.length > 0) {
      for (let i = 0; i < this.tmpselectedRentangTanggal.length; i++) {
        formateddate.push(moment(this.tmpselectedRentangTanggal[i]).format('DD/MM/YYYY'))
      }

      // console.log(formateddate)

      for(let i=0; i<formateddate.length; i++)
      {
        this.db.collection('Transaksi', ref => ref.where('tanggal', '==', `${formateddate[i]}`))
        .valueChanges()
        .subscribe(data => {
          data = data.reverse();
          if(data.length > 0)
          {
            for(let j=0; j<data.length; j++)
            {
              this.transaksi.push(data[j]);
            }
          }
          // this.transaksi = this.transaksi.reverse();
          console.log(this.transaksi);
        });
      }
    }

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
    else if(this.tmpfilter == "Bulan Ini")
    {
      this.filter = "Bulan";
      this.keteranganwaktubulan = moment(this.tanggalhariini, "DD/MM/YYYY").format('MM')
      this.keteranganwaktutahun = moment(this.tanggalhariini, "DD/MM/YYYY").format('YYYY')
      this.getPenjualanBulanIni();
    }
    else if(this.tmpfilter == "Tahun Ini")
    {
      this.filter = "Tahun";
      this.keteranganwaktutahun = moment(this.tanggalhariini, "DD/MM/YYYY").format('YYYY')
      this.getPenjualanTahunIni();
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
