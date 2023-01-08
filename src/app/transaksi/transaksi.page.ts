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
  ctrpelangganterakhir = 0;;
  loggeduser;
  invoicenumber;
  transaksiaktif = [];
  kategori = [];
  SelectedTransaksiID;
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
    this.getKategori();
    this.getAllItem();
  }

  getTransaksiAktif() {

    this.db.collection(`TransaksiAktif`, ref => ref.orderBy('InvoiceID', 'asc'))
      .valueChanges({ idField: 'TransaksiID' })
      .subscribe(data => {
        this.transaksiaktif = data;
        // console.log(this.transaksiaktif)
      }
      );
  }

  getKategori()
  {
    this.db.collection('Kategori')
      .valueChanges()
      .subscribe(data => {
        this.kategori = data;
        console.log(this.kategori)
        this.getAllItem();
      }
      );
  }

  getAllItem()
  {
    console.log(this.kategori)
  }

  async LaporanPenjualan()
  {
    this.router.navigateByUrl('/penjualan-admin', {replaceUrl: true});
  }

  async tambahtransaksi()
  {
    this.ctrpelangganterakhir = 0;
    this.ctrpelanggan = 0;
    for(let i=0; i<this.transaksiaktif.length; i++)
    {
      this.ctrpelangganterakhir = this.transaksiaktif[i].transaksike;
    }
    // console.log("no pelanggan terakhir: ", this.ctrpelangganterakhir);
    // this.ctrpelanggan = this.ctrpelangganterakhir+1;
    // console.log("no pelanggan selanjutnya: ", this.ctrpelanggan);
    this.generateinvoice();

    let datatrans = {
      InvoiceID : this.invoicenumber,
      tanggal: moment().format('L'),
      hari: moment().format('dddd'),  
      waktu: moment().format('LTS'),
      timestamp: moment().format(),
      cabang: this.loggeduser,
      transaksike: this.ctrpelanggan
    }

    const res = await this.db.collection(`TransaksiAktif`).add(datatrans);

  }

  SelectedTransaksi(Item)
  {
    // console.log(Item);
    this.SelectedTransaksiID = Item.TransaksiID;  
    // console.log(this.SelectedTransaksiID);
  }

  generateinvoice()
  {
    this.invoicenumber = this.invoicegenerator.generateinvoice();
    // console.log(this.invoicenumber);
  }

  BatalkanTransaksi()
  {
    const TypeRef = doc(this.firestore, `TransaksiAktif/${this.SelectedTransaksiID}`);
    deleteDoc(TypeRef);
    this.transaksi = "";
  }

}
