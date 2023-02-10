import { Component, OnInit } from '@angular/core';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { take } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.page.html',
  styleUrls: ['./kategori.page.scss'],
})
export class KategoriPage implements OnInit {

  tmpcabang = [];
  tmpKategori = [];
  masukkankategori = false;
  namakategoribaru = "";
  constructor(private db: AngularFirestore, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getCabang();
    this.getKategori();
  }

  getKategori()
  {
    this.db.collection('Kategori', ref => ref.orderBy('namakategori'))
      .valueChanges({ idField: 'CategoryID' })
      .subscribe(data => {
        this.tmpKategori = data;
        console.log(this.tmpKategori);
        //hapus Handphone
        this.tmpKategori.forEach((element, index) => {
          if (element.namakategori == "Handphone") this.tmpKategori.splice(index, 1);
        });
      }
      );
  }

  getCabang()
  {
    this.db.collection('Cabang', ref => ref.orderBy('namacabang'))
        .valueChanges({ idField: 'CabangID' }).pipe(take(1))
        .subscribe( data => {
            this.tmpcabang = data;   
            console.log(this.tmpcabang);
        }
    );
  }

  tambahKategori()
  {

  }

  Dismissmodal()
  {
    this.modalCtrl.dismiss();
  }
  
  SaveKategori()
  {
    if(this.namakategoribaru == "")
    {
      this.masukkankategori = true;
    }
    else
    {
      this.masukkankategori = false;
    }
  }


}
