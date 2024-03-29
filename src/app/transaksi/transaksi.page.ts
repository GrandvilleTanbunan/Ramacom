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
  tmpcabang = [];
  invoicenumber;
  transaksiaktif = [];
  kategori = [];
  SelectedTransaksiID;
  SelectedTransaksiDetail;
  AllItem = [];
  AllHp = [];
  tmpstock = [];
  tmpstockItem = [];
  tmptype = [];
  tmpbrand;
  public results = [];
  public resultsHP = [];
  tmpitem = [];
  input: any;
  Dtrans;
  barangkembar = false;
  grandtotal = 0;
  // keranjang = [];
  constructor(public popoverController: PopoverController, private alertCtrl: AlertController,private toastController: ToastController, private loadingCtrl: LoadingController, private firestore: Firestore, private dataService:DataService,private db: AngularFirestore, private router: Router, private modalCtrl: ModalController, private invoicegenerator: InvoicegeneratorService, private authService: AuthService) {
    this.categories= [];
    // this.category = "";
    moment.locale('id');
    this.authService.loginStatus$.subscribe(user => {
      this.loggeduser = user;
      console.log("logged user: ", this.loggeduser);
      this.getTransaksiAktif();

    });

   }
  ngOnInit() {
    // this.getTransaksiAktif();
    this.getKategori();
    this.getBrand();
  }

 

  getTransaksiAktif() {
    console.log(this.loggeduser)
    this.db.collection(`TransaksiAktif`, ref => ref.where('cabang', '==', `${this.loggeduser}`))
      .valueChanges({ idField: 'TransaksiID' })
      .subscribe(data => {
        this.transaksiaktif = data;
        console.log(this.transaksiaktif)
      }
      );
  }

  getKategori()
  {
    this.db.collection('Kategori')
      .valueChanges()
      .pipe(take(1))
      .subscribe(data => {
        this.kategori = data;
        console.log(this.kategori)
        this.getAllItem();

      }
      );
  }

  

  getAllItem()
  {
    console.log("category: ", this.kategori)

    for (let i = 0; i < this.kategori.length; i++) {
      this.db.collection(`${this.kategori[i].namakategori}`)
        .valueChanges({ idField: 'ID' })
        .pipe(take(1))
        .subscribe(data => {
          for(let j=0; j<data.length; j++)
          {
            this.AllItem.push(data[j]);
            this.getStockItemDicabang(i, data[j])
          }
        }
        );
    }
  }

  getStockItemDicabang(i, data)
  {

    this.tmpstockItem = [];
    this.db.collection(`${this.kategori[i].namakategori}/${data.ID}/stockdicabang`).doc(this.loggeduser).valueChanges()
    .pipe(take(1))
    .subscribe(dataku => {
      this.tmpstockItem.push({kategori: data.kategori, nama: data.nama, harga: data.harga, ID: data.ID, dataku });
    });
    console.log(this.tmpstockItem);
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

  getAllType() {
    for (let i = 0; i < this.tmpbrand.length; i++) {
      this.db.collection(`Brand/${this.tmpbrand[i].BrandID}/Type`, ref => ref.orderBy('type', 'asc'))
        .valueChanges({ idField: 'ID', type: 'type' }).pipe(take(1))
        .subscribe(data => {
          // console.log(data);
          for (let j = 0; j < data.length; j++) {
            this.AllHp.push(data[j]);
            this.getStockDicabang(i, data[j], this.tmpbrand[i].BrandID);
            
          }
        });
        // console.log(this.AllHp);

    }
  }

  getStockDicabang(i, data, BrandID)
  {
    this.tmpstock = [];
    // console.log("logged user getstockdicabang: " + this.loggeduser);
    this.db.collection(`Brand/${this.tmpbrand[i].BrandID}/Type/${data.ID}/stockdicabang`).doc(this.loggeduser).valueChanges()
    // .pipe(take(1))
    .subscribe(dataku => {
      this.tmpstock.push({kategori:"Brand", type: data.type, harga: data.harga, ID: data.ID, BrandID: BrandID, dataku });
    });
    // console.log(this.tmpstock)
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
            this.db.collection(`TransaksiAktif`).doc(`${this.invoicenumber}`).set({
              InvoiceID : this.invoicenumber,
              tanggal: moment().format('L'),
              hari: moment().format('dddd'),
              bulan: moment().format('MM'),
              tahun: moment().format('yyyy'),
              waktu: moment().format('LTS'),
              timestamp: moment().format(),
              cabang: this.loggeduser,
              transaksike: this.ctrpelanggan
            })
          }
        }
      ]
    });
    await alert.present();

    

  }

  SelectedTransaksi(Item)
  {
    console.log(Item);
    this.SelectedTransaksiID = Item.TransaksiID; 
    this.SelectedTransaksiDetail = Item;
    // console.log(this.SelectedTransaksiID);
    // console.log(this.SelectedTransaksiDetail.InvoiceID);

    this.db.collection(`TransaksiAktif/${this.SelectedTransaksiID}/Item`, ref => ref.orderBy('timestamp', 'asc'))
    .valueChanges({ idField: 'DetailID' })
    .subscribe(data => {
      this.Dtrans = data;
      // console.log(this.Dtrans)
      this.hitungGrandTotal();
    }
    );
    this.input = undefined;

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
                this.deletecoll(this.SelectedTransaksiID);
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

  async deletecoll(TransaksiID)
  {
    console.log(TransaksiID);
    console.log(this.Dtrans.length);
    let jumlahitem = this.Dtrans.length;
    let DeletedReadyDetailID = [];
    for(let i=0; i<this.Dtrans.length; i++)
    {
      DeletedReadyDetailID.push(this.Dtrans[i].DetailID)
    }
    for(let i=0; i<jumlahitem; i++)
    {
      // console.log(i);

      const res = await this.db.collection(`TransaksiAktif/${TransaksiID}/Item`).doc(DeletedReadyDetailID[i]).delete();
    }
    
  }

  async CariItem(event: any) {
    const val = event.target.value;
    this.results = [];
    this.resultsHP = [];
    this.results = this.tmpstockItem.filter((item) => {
      return (
        item.nama.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.harga.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.kategori.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.dataku.jumlah.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
      )
    });

    // console.log(this.AllHp);
    // const val = event.target.value;
    this.resultsHP = this.tmpstock.filter((item) => {
      return (
        item.type.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.harga.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.kategori.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.dataku.jumlah.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.BrandID.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
      )
    });
  }

  async TambahItem(item : any)
  {
    console.log(item)
    for(let i=0; i<this.Dtrans.length; i++)
    {
      if(this.Dtrans[i].IDBarang == item.ID)
      {
        this.barangkembar = true;
      }
    }
    if(this.barangkembar == true)
    {
      console.log("Barang sudah ada");
      const toast = await this.toastController.create({
        message: 'Item sudah ada di dalam keranjang!',
        duration: 1000,
        position: 'bottom'
      });
      await toast.present();
      this.barangkembar = false;

    }
    else{
      let TambahanItem;
      if(item.dataku.jumlah == "0")
      {
        console.log("Stock tidak tersedia di cabang ini!")
        const toast = await this.toastController.create({
          message: 'Stock tidak tersedia di cabang ini!',
          duration: 1000,
          position: 'bottom'
        });
        await toast.present();
      }
      else{
        if(item.nama)
        {
          TambahanItem = {
            IDBarang: item.ID,
            nama : item.nama,
            harga: item.harga,
            hargatotal: item.harga,
            jumlah: 1,
            kategori: item.kategori,
            stockdicabang: item.dataku.jumlah,
            timestamp: moment().format(),
          }
        }
        else
        {
          TambahanItem = {
            IDBarang: item.ID,
            nama : item.type,
            harga: item.harga,
            hargatotal: item.harga,
            jumlah: 1,
            kategori: item.kategori,
            stockdicabang: item.dataku.jumlah,
            timestamp: moment().format(),
            BrandID: item.BrandID

          }
        }
        // console.log(item);
        console.log(TambahanItem)
        // const ref = collection(this.firestore, `Dtrans/${this.SelectedTransaksiDetail.InvoiceID}`);
        // return addDoc(ref, keranjang);
        this.db.collection(`TransaksiAktif/${this.SelectedTransaksiDetail.InvoiceID}/Item`).add(TambahanItem);
        this.input = undefined;
      }
      
    }
    
  }

  async HapusItem(item: any)
  {
    console.log(item)
    // const res = await this.db.collection(`TransaksiAktif/${this.SelectedTransaksiDetail.InvoiceID}/Item`).doc(item.DetailID).delete();

    let alert = await this.alertCtrl.create({

      subHeader: 'Hapus item?',
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
              const res = await this.db.collection(`TransaksiAktif/${this.SelectedTransaksiDetail.InvoiceID}/Item`).doc(item.DetailID).delete().then(async ()=>{
                loading.dismiss();
                const toast = await this.toastController.create({
                  message: 'Item berhasil dihapus',
                  duration: 700,
                  position: 'bottom'
                });
                await toast.present();
              });
            });
          }
        }
      ]
    });
    await alert.present();

  }

  async UpdateJumlah(item: any)
  {
    console.log(item.jumlah)
    let hargabaru = 0;
    if(item.jumlah<=1 || item.jumlah < 1) 
    {
      item.jumlah = 1;
      hargabaru = item.harga*item.jumlah;
      // console.log(hargabaru);
    }
    else if(item.jumlah >= 999 || item.jumlah > 999)
    {
      item.jumlah = 999;
      hargabaru = item.harga*item.jumlah;
      // console.log(hargabaru);
    }
    else
    {
      hargabaru = item.harga*item.jumlah;
      // console.log(hargabaru);
    }
    
    const UpdateJumlah = this.db.collection(`TransaksiAktif/${this.SelectedTransaksiDetail.InvoiceID}/Item`).doc(`${item.DetailID}`);
    
    const res1 = await UpdateJumlah.update({jumlah: item.jumlah, hargatotal: hargabaru});
    
  }

  async decrement(item: any)
  {
    let hargabaru = 0;
    if(item.jumlah<=1) 
    {
      item.jumlah = 1;
      hargabaru = item.harga*item.jumlah;
      // console.log(hargabaru);
    }
    else
    {
      item.jumlah--;
      hargabaru = item.harga*item.jumlah;

      // console.log(hargabaru);
    }
    
    const UpdateJumlah = this.db.collection(`TransaksiAktif/${this.SelectedTransaksiDetail.InvoiceID}/Item`).doc(`${item.DetailID}`);
    
    const res1 = await UpdateJumlah.update({jumlah: item.jumlah, hargatotal: hargabaru});
  }

  async increment(item: any)
  {
    let hargabaru = 0;
    // console.log(item);
    if(item.stockdicabang>item.jumlah)
    {
      // console.log("masuk if")
      if(item.jumlah >= 999) 
      {
        item.jumlah = 999;
        hargabaru = item.harga*item.jumlah;
  
        // console.log(hargabaru);
      }
      else
      {
        item.jumlah++;
        hargabaru = item.harga*item.jumlah;
  
        // console.log(hargabaru);
      }
  
      const UpdateJumlah = this.db.collection(`TransaksiAktif/${this.SelectedTransaksiDetail.InvoiceID}/Item`).doc(`${item.DetailID}`);
      
      const res1 = await UpdateJumlah.update({jumlah: item.jumlah, hargatotal: hargabaru});
    }
    else
    {
      const toast = await this.toastController.create({
        message: 'Stock tidak cukup!',
        duration: 700,
        position: 'bottom'
      });
      await toast.present();
    }
    
  }

  hitungGrandTotal()
  {
    this.grandtotal = 0;
    for(let i=0; i<this.Dtrans.length; i++)
    {
      this.grandtotal = this.grandtotal + this.Dtrans[i].hargatotal;
    }
    // console.log(this.grandtotal);

  }

  async CheckOut()
  {
    console.log(this.SelectedTransaksiDetail);
    console.log(this.Dtrans);

    let alert = await this.alertCtrl.create({

      subHeader: 'Checkout Transaksi?',
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
              this.modalCtrl.dismiss();

              this.transaksi = "";

              console.log(this.Dtrans);

              this.db.collection(`Transaksi`).doc(`${this.SelectedTransaksiID}`).set(
                {
                  InvoiceID: this.SelectedTransaksiDetail.InvoiceID, 
                  TransaksiID: this.SelectedTransaksiDetail.TransaksiID,
                  cabang: this.SelectedTransaksiDetail.cabang,
                  hari: this.SelectedTransaksiDetail.hari,
                  bulan: this.SelectedTransaksiDetail.bulan,
                  tahun: this.SelectedTransaksiDetail.tahun,
                  tanggal: this.SelectedTransaksiDetail.tanggal,
                  timestamp: this.SelectedTransaksiDetail.timestamp,
                  transaksike: this.SelectedTransaksiDetail.transaksike,
                  waktu: this.SelectedTransaksiDetail.waktu,
                  grandtotal: this.grandtotal
                }).then(async () => {
                for (let i = 0; i < this.Dtrans.length; i++) {
                  this.db.collection(`Transaksi/${this.SelectedTransaksiID}/Item`).add(this.Dtrans[i]);
                  console.log(this.Dtrans)
                  if(this.Dtrans[i].kategori == "Brand")
                  {
                    this.db.doc(`Brand/${this.Dtrans[i].BrandID}/Type/${this.Dtrans[i].IDBarang}/stockdicabang/${this.loggeduser}`).update({jumlah: this.Dtrans[i].stockdicabang - this.Dtrans[i].jumlah}).then(async ()=>{
                      this.getBrand();
                      
                      const toast = await this.toastController.create({
                        message: 'Stock berhasil diupdate!',
                        duration: 1000,
                        position: 'bottom'
                      });
                      await toast.present();
                    })
                  }
                  else
                  {
                    this.db.doc(`${this.Dtrans[i].kategori}/${this.Dtrans[i].IDBarang}/stockdicabang/${this.loggeduser}`).update({jumlah: this.Dtrans[i].stockdicabang - this.Dtrans[i].jumlah}).then(async ()=>{
                      this.getKategori();
                      
                      const toast = await this.toastController.create({
                        message: 'Stock berhasil diupdate!',
                        duration: 1000,
                        position: 'bottom'
                      });
                      await toast.present();
                    })
                  }
                  
                }
                //hapus collection di 
                this.deletecoll(this.SelectedTransaksiID).then(() => {
                  const TypeRef = doc(this.firestore, `TransaksiAktif/${this.SelectedTransaksiID}`);
                  deleteDoc(TypeRef).then(async () => {
                    loading.dismiss();
                    const toast = await this.toastController.create({
                      message: 'Checkout Berhasil!',
                      duration: 700,
                      position: 'bottom'
                    });
                    await toast.present();
                  });
                });

                // this.getAllItem();
                this.getKategori();
                this.getBrand();
                //update stock
                // for(let i=0; i<)

              });
            });
          }
        }
      ]
    });
    await alert.present();


  }

  Dismissmodal()
  {
    this.modalCtrl.dismiss();
  }
}
