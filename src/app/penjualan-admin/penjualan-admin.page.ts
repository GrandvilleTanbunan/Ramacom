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
import { AuthService } from '../auth.service';
import { TahuniniPage } from '../tahunini/tahunini.page';




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
  rentangtanggalselected = false;
  grandtotal = 0;

  loggeduser;
  namabulan = ['JANUARI','FEBRUARI','MARET','APRIL','MEI','JUNI','JULI','AGUSTUS','SEPTEMBER','OKTOBER','NOVEMBER','DESEMBER']

  constructor(private authService: AuthService, private loadingCtrl: LoadingController, private db: AngularFirestore, private modalCtrl: ModalController, private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    
   }

  ngOnInit() {
    moment.locale('id');
    this.tanggalhariini = moment().format("L");
    this.getPenjualanHariini();

    this.authService.loginStatus$.subscribe(user => {
      this.loggeduser = user;
      console.log("logged user: ", this.loggeduser);
    });
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
    this.rentangtanggalselected = false;
    this.keteranganwaktu = moment().format('L');
    this.db.collection('Transaksi', ref => ref.where('tanggal', '==', `${this.keteranganwaktu}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
        console.log(this.transaksihariini);
        this.hitunggrandtotal(this.transaksi);
      });
  }

  getPenjualanBulanIni() {
    this.rentangtanggalselected = false;
    this.keteranganwaktu = moment(this.tanggalhariini, "DD/MM/YYYY").format('MMMM YYYY');    
    this.db.collection('Transaksi', ref => ref.where('bulan', '==', `${this.keteranganwaktubulan}`).where('tahun', '==', `${this.keteranganwaktutahun}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
        this.hitunggrandtotal(this.transaksi);
      });
  }
  getPenjualanTahunIni()
  {
    this.rentangtanggalselected = false;
    this.keteranganwaktu = moment(this.tanggalhariini, "DD/MM/YYYY").format('YYYY');    
    this.db.collection('Transaksi', ref => ref.where('tahun', '==', `${this.keteranganwaktutahun}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
        this.hitunggrandtotal(this.transaksi);
      });
  }

  public PilihTanggal(): void {
    this.tmpfilter = "Pilih Tanggal";

    this.rentangtanggalselected = false;
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
        this.hitunggrandtotal(this.transaksi);
      });
  }

  public PilihRentangTanggal(date): void {
    this.tmpfilter = "Pilih Banyak Tanggal";
    console.log(date);
    this.rentangtanggalselected = true;
    this.transaksi = [];
    this.grandtotal = 0;
    for (let i = 0; i < date.length; i++) {
      this.db.collection('Transaksi', ref => ref.where('tanggal', '==', `${moment(date[i], "YYYY-MM-DD").format('DD/MM/YYYY')}`))
        .valueChanges()
        .subscribe(data => {
          data = data.reverse();
          // console.log(data)
          if (data.length > 0) {
            for (let j = 0; j < data.length; j++) {
              this.transaksi.push(data[j]);
            }
          }
          // this.transaksi = this.transaksi.reverse();
          console.log(this.transaksi);
          this.hitunggrandtotal(this.transaksi);

        });

    }



    // }

  }

  PilihBulan(bulan)
  {
    this.tmpfilter = "Pilih Bulan";
    this.keteranganwaktubulan = moment(bulan).format('MM')
    this.keteranganwaktutahun = moment(bulan).format('YYYY')
    this.filter = "Bulan"
    this.rentangtanggalselected = false;
    this.keteranganwaktu = moment(this.keteranganwaktubulan).format('MMMM') + " " + this.keteranganwaktutahun;    
    this.db.collection('Transaksi', ref => ref.where('bulan', '==', `${this.keteranganwaktubulan}`).where('tahun', '==', `${this.keteranganwaktutahun}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
        this.hitunggrandtotal(this.transaksi);

      });
    console.log(bulan)
    console.log(moment(bulan).format('MM/YYYY'))
  }

  PilihTahun(tahun)
  {
    this.tmpfilter = "Pilih Tahun"
    this.keteranganwaktutahun = moment(tahun).format('YYYY')
    this.rentangtanggalselected = false;
    this.keteranganwaktu = this.keteranganwaktutahun;  
    this.filter = "Tahun"  
    this.db.collection('Transaksi', ref => ref.where('tahun', '==', `${this.keteranganwaktutahun}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
        this.hitunggrandtotal(this.transaksi);

      });
  }

  async selectbulan(bulan)
  {
    console.log(bulan);
    let modal = await this.modalCtrl.create({
      component: TahuniniPage,
      componentProps: {
        bulan: bulan,
      },
      cssClass: 'cart-modal'
    });
    modal.present();
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

  hitunggrandtotal(transaksi)
  {
    this.grandtotal = 0;
    console.log(transaksi)
    for(let i=0; i<transaksi.length; i++)
    {
      this.grandtotal = this.grandtotal + parseInt(transaksi[i].grandtotal);
      // console.log(this.grandtotal)
    }
  }

  Dismissmodal()
  {
    this.modalCtrl.dismiss();

  }

}
