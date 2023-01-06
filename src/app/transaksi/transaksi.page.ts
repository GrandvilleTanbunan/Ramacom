import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PenjualanAdminPage } from '../penjualan-admin/penjualan-admin.page';
import { Router } from '@angular/router';
import { InvoicegeneratorService } from '../invoicegenerator.service';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, orderBy, where} from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc} from '@angular/fire/firestore';

import * as moment from 'moment';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.page.html',
  styleUrls: ['./transaksi.page.scss'],
})
export class TransaksiPage implements OnInit {
  categories: any;
  transaksi : string;
  ctrpelanggan= 1;
  loggeduser;
  invoicenumber;
  transaksiaktif = [];
  constructor(private firestore: Firestore, private dataService:DataService,private db: AngularFirestore, private router: Router, private modalCtrl: ModalController, private invoicegenerator: InvoicegeneratorService, private authService: AuthService) {
    this.categories= [];
    // this.category = "";

    this.authService.loginStatus$.subscribe(user => {
      this.loggeduser = user;
      console.log("logged user: ", this.loggeduser);
    });

   }
  ngOnInit() {
    this.getTransaksiAktif();
  }

  getTransaksiAktif() {

    this.db.collection(`TransaksiAktif`, ref => ref.orderBy('InvoiceID', 'asc'))
      .valueChanges()
      .subscribe(data => {
        this.transaksiaktif = data;
        // console.log(this.transaksiaktif)
      }
      );
  }

  async LaporanPenjualan()
  {
    this.router.navigateByUrl('/penjualan-admin', {replaceUrl: true});
  }

  async tambahtransaksi()
  {
    this.categories.push(this.ctrpelanggan);
    this.ctrpelanggan++;
    this.generateinvoice();

    // this.dataService

    let datatrans = {
      InvoiceID : this.invoicenumber,
      tanggal: moment().format('L'),
      hari: moment().format('dddd'),  
      waktu: moment().format('LTS'),
      timestamp: moment().format(),
      cabang: this.loggeduser
    }
    const res = await this.db.collection(`TransaksiAktif`).add(datatrans);
  }

  check()
  {
    console.log(this.transaksi)
  }

  generateinvoice()
  {
    this.invoicenumber = this.invoicegenerator.generateinvoice();
    console.log(this.invoicenumber);
  }

}
