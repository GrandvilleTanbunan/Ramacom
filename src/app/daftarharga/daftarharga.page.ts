import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { EdithargaPage } from '../editharga/editharga.page';


@Component({
  selector: 'app-daftarharga',
  templateUrl: './daftarharga.page.html',
  styleUrls: ['./daftarharga.page.scss'],
})
export class DaftarhargaPage implements OnInit {
  selectedKategori = "";
  tmpKategori = [];
  tmpbrand = [];
  tmpisikategori= [];
  public results = [];
  constructor(private modalCtrl: ModalController, private db: AngularFirestore) { }

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
      return (item.ID.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.nama.toLowerCase().indexOf(val.toLowerCase()) > -1 ||
        item.harga.toLowerCase().indexOf(val.toLowerCase()) > -1
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
      },
    });
    await modal.present();
  }
  

}
