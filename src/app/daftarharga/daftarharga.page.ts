import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, AlertController } from '@ionic/angular';
import { EdithargaPage } from '../editharga/editharga.page';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../services/data.service';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-daftarharga',
  templateUrl: './daftarharga.page.html',
  styleUrls: ['./daftarharga.page.scss'],
})
export class DaftarhargaPage implements OnInit {
  selectedKategori = "";
  selectedbrand;
  tmpKategori = [];
  tmpbrand = [];
  tmpisikategori= [];
  public results = [];
  public tmptype;
  public loggeduser;
  constructor(private alertCtrl:AlertController ,private authService: AuthService, private currencyPipe: CurrencyPipe, private modalCtrl: ModalController, private db: AngularFirestore, private dataService: DataService) {
    
   }

  ngOnInit() {
    this.getKategori();

    this.authService.loginStatus$.subscribe(user => {
      this.loggeduser = user;
      console.log("Logged user daftar harga: ", this.loggeduser);

    });


  }

  getKategori()
  {
    this.db.collection('Kategori', ref => ref.orderBy('namakategori'))
        .valueChanges({ idField: 'CategoryID' })
        .subscribe( data => {
            this.tmpKategori = data;   
            console.log(this.tmpKategori);
        }
    );
  }

  getHargaHp()
  {
    this.db.collection(`Brand/${this.selectedbrand}/Type`, ref => ref.orderBy('type', 'asc'))
        .valueChanges({ idField: 'TypeID' })
        .subscribe( data => {
            this.tmptype = data;
            this.results = [...this.tmptype];
            console.log(this.tmptype)
        }
        
    );
  }

  PilihKategori(): void 
  {
    this.results=[];
    this.tmpisikategori = [];
    console.log(this.selectedKategori);
    if (this.selectedKategori == "Handphone") {
      this.db.collection('Brand', ref => ref.orderBy('namabrand'))
        .valueChanges({ idField: 'ID' })
        .subscribe(data => {
          this.tmpisikategori = data;
          console.log(this.tmpisikategori);
        }
        );
    }

    else
    {
      this.db.collection(`${this.selectedKategori}`)
      .valueChanges({ idField: 'ID' })
      .subscribe(data => {
        this.tmpisikategori = data;
        this.results = [...this.tmpisikategori];
        console.log(this.tmpisikategori);
      }
      );
    }
  }

  CariItem(event : any) {
    const val = event.target.value;
    this.results = this.tmpisikategori.filter((item) => {
      return (item.ID.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.nama.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.harga.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
      )
    });
  }

  CariItemHp(event : any) {
    console.log(this.tmptype);
    const val = event.target.value;
    this.results = this.tmptype.filter((item) => {
      return (item.type.toString().toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.harga.toString().toLowerCase().indexOf(val.toLowerCase()) > -1
      )
    });
  }

  // EditHarga(item)
  // {
  //   console.log(item);
  // }

  async EditHarga(item) {

    
    // console.log(item);
    if (this.loggeduser == 'admin') {
      console.log(this.loggeduser);
      const modal = await this.modalCtrl.create({
        component: EdithargaPage,
        cssClass: 'small-modal',
        componentProps: {
          detailitem: item,
          kategori: this.selectedKategori
        },
      });
      await modal.present();
    }
    else
    {
      const alert = await this.alertCtrl.create({
        header: 'Login sebagai admin untuk mengedit harga.',
        buttons: ['OK'],
        mode:'ios'

      });
      await alert.present();
    }
    
  }

  async EditHargaHp(item) {
    if(this.loggeduser == 'admin')
    {
      const modal = await this.modalCtrl.create({
        component: EdithargaPage,
        cssClass:'small-modal',
        componentProps: {
          detailitem: item,
          IDBrand: this.selectedbrand,
          kategori: this.selectedKategori
        },
      });
      await modal.present();
    }
    else
    {
      const alert = await this.alertCtrl.create({
        header: 'Login sebagai admin untuk mengedit harga.',
        buttons: ['OK'],
        mode:'ios'
      });
      await alert.present();
    }
    
  }
  

}
