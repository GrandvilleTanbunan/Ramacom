import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { EdithargaPage } from '../editharga/editharga.page';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../services/data.service';



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
  constructor(private currencyPipe: CurrencyPipe, private modalCtrl: ModalController, private db: AngularFirestore, private dataService: DataService) { }

  ngOnInit() {
    this.getKategori();
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
            console.log(this.tmptype)
        }
        
    );
  }

  PilihKategori(): void 
  {
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

  // EditHarga(item)
  // {
  //   console.log(item);
  // }

  async EditHarga(item) {
    // console.log(item);

    const modal = await this.modalCtrl.create({
      component: EdithargaPage,
      cssClass:'small-modal',
      componentProps: {
        detailitem: item,
        kategori: this.selectedKategori
      },
    });
    await modal.present();
  }

  async EditHargaHp(item) {

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
  

}
