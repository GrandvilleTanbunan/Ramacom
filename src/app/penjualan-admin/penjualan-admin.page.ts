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
  constructor(private loadingCtrl: LoadingController, private db: AngularFirestore, private modalCtrl: ModalController, private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    
   }

  ngOnInit() {
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

  }

  setFilter(filter: string)
  {
    this.transaksi = [];
    moment().locale("id");
    // console.log("Bulan & tahun sekarang: "+this.bulandantahunsekarang);
    this.tmpfilter = filter;
    // console.log(filter)
    if(this.tmpfilter == "Hari ini")
    {
      this.getPenjualanHariini();
    }
    // else if(this.tmpfilter == "Bulan ini")
    // {
    //   for(let i=0; i<this.tmpallnotif.length; i++){
    //     if(this.bulandantahunsekarang == moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('MM/YYYY'))
    //     {
    //       this.notiffinal.push(this.tmpallnotif[i]);
    //       // console.log(this.notiffinal);
    //     }
    //   }
    // }
    // else if(this.tmpfilter == "Tahun ini")
    // {
    //   for(let i=0; i<this.tmpallnotif.length; i++){
    //     if(this.tahunsekarang == moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('YYYY'))
    //     {
    //       this.notiffinal.push(this.tmpallnotif[i]);
    //       // console.log(this.notiffinal);
    //     }
    //   }
    // }
    
  }

  Dismissmodal()
  {
    this.modalCtrl.dismiss();

  }

}
