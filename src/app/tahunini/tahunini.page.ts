import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tahunini',
  templateUrl: './tahunini.page.html',
  styleUrls: ['./tahunini.page.scss'],
})
export class TahuniniPage implements OnInit {
  bulan;
  tmpbulan;
  tanggalhariini;
  tahunini;
  keteranganwaktu;
  transaksi;
  grandtotal;
  constructor(private db: AngularFirestore, private modalCtrl: ModalController) {
   }

  ngOnInit() {
    moment.locale('id');
    console.log(this.bulan)
    this.tanggalhariini = moment().format("L");
    this.getPenjualanTahunIni();
  }

  getPenjualanTahunIni()
  {
    this.tahunini = moment(this.tanggalhariini, "DD/MM/YYYY").format('YYYY');    
    this.tmpbulan = moment(this.bulan, "MMMM").format('MM');
    this.db.collection('Transaksi', ref => ref.where('tahun', '==', `${this.tahunini}`).where('bulan', '==', `${this.tmpbulan}`))
      .valueChanges()
      .subscribe(data => {
        this.transaksi = data;
        this.transaksi = this.transaksi.reverse();
        this.hitunggrandtotal(this.transaksi);
      });
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

  close()
  {
    this.modalCtrl.dismiss();
  }

}
