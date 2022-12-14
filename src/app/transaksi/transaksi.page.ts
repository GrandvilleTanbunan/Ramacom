import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController,PopoverController } from '@ionic/angular';
import { PenjualanAdminPage } from '../penjualan-admin/penjualan-admin.page';
import { Router } from '@angular/router';
import { InvoicegeneratorService } from '../invoicegenerator.service';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, orderBy, where} from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc} from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { DataService } from '../services/data.service';
import { PopoversearchComponent } from '../popoversearch/popoversearch.component';

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
  SelectedTransaksiDetail;
  AllItem = [];
  AllHp = [];
  tmpbrand;
  public results = [];
  public resultsHP = [];
  tmpitem = [];
  input: any;
  constructor(public popoverController: PopoverController, private alertCtrl: AlertController,private toastController: ToastController, private loadingCtrl: LoadingController, private firestore: Firestore, private dataService:DataService,private db: AngularFirestore, private router: Router, private modalCtrl: ModalController, private invoicegenerator: InvoicegeneratorService, private authService: AuthService) {
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
    this.getBrand();
  }

  getTransaksiAktif() {

    this.db.collection(`TransaksiAktif`, ref => ref.orderBy('transaksike', 'asc'))
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
      .valueChanges().pipe(take(1))
      .subscribe(data => {
        this.kategori = data;
        console.log(this.kategori)
        this.getAllItem();

      }
      );
  }

  getBrand()
  {
    this.db.collection('Brand', ref => ref.orderBy('namabrand'))
        .valueChanges({ idField: 'BrandID' }).pipe(take(1))
        .subscribe( data => {
            this.tmpbrand = data;
            this.getAllType();
        }
    );
  }

  getAllItem()
  {
    console.log("category: ", this.kategori)

    for (let i = 0; i < this.kategori.length; i++) {
      this.db.collection(`${this.kategori[i].namakategori}`)
        .valueChanges({ idField: 'ID' }).pipe(take(1))
        .subscribe(data => {
          for(let j=0; j<data.length; j++)
          {
            this.AllItem.push(data[j]);
          }
        }
        );
        console.log(this.AllItem);
    }
  }

  getAllType() {
    for (let i = 0; i < this.tmpbrand.length; i++) {
      this.db.collection(`Brand/${this.tmpbrand[i].BrandID}/Type`, ref => ref.orderBy('type', 'asc'))
        .valueChanges({ idField: 'ID' }).pipe(take(1))
        .subscribe(data => {
          for (let j = 0; j < data.length; j++) {
            this.AllHp.push(data[j]);
          }
        }
        );
    }
    console.log(this.AllHp)
  }



  async LaporanPenjualan()
  {
    this.router.navigateByUrl('/penjualan-admin', {replaceUrl: true});
  }

  async tambahtransaksi()
  {

    this.ctrpelangganterakhir = 0;
    this.ctrpelanggan = 0;
    let alert = await this.alertCtrl.create({

      subHeader: 'Tambah transaksi?',
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
            for(let i=0; i<this.transaksiaktif.length; i++)
            {
              this.ctrpelangganterakhir = this.transaksiaktif[i].transaksike;
            }
            // console.log("no pelanggan terakhir: ", this.ctrpelangganterakhir);
            this.ctrpelanggan = this.ctrpelangganterakhir+1;
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
        }
      ]
    });
    await alert.present();

    

  }

  SelectedTransaksi(Item)
  {
    // console.log(Item);
    this.SelectedTransaksiID = Item.TransaksiID; 
    this.SelectedTransaksiDetail = Item;
    // console.log(this.SelectedTransaksiID);
  }

  generateinvoice()
  {
    this.invoicenumber = this.invoicegenerator.generateinvoice();
    // console.log(this.invoicenumber);
  }

  async BatalkanTransaksi()
  {
      let alert = await this.alertCtrl.create({

        subHeader: 'Batalkan transaksi?',
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
          
              loading.present().then(() => {
                const TypeRef = doc(this.firestore, `TransaksiAktif/${this.SelectedTransaksiID}`);
                deleteDoc(TypeRef).then(async ()=>{
                  loading.dismiss();
                  const toast = await this.toastController.create({
                    message: 'Transaksi Dibatalkan',
                    duration: 700,
                    position: 'bottom'
                  });
                  await toast.present();
          
                });
                this.transaksi = "";
              });
            }
          }
        ]
      });
      await alert.present();

  }

  async CariItem(event: any) {
    const val = event.target.value;
    this.results = this.AllItem.filter((item) => {
      return (
        item.nama.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.harga.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
      )
    });

    // console.log(this.AllHp);
    // const val = event.target.value;
    this.resultsHP = this.AllHp.filter((item) => {
      return (
        item.type.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.harga.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
      )
    });

  }

  TambahItem(item : any)
  {
    console.log(item)
  }
}
