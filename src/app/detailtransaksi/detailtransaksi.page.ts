import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-detailtransaksi',
  templateUrl: './detailtransaksi.page.html',
  styleUrls: ['./detailtransaksi.page.scss'],
})
export class DetailtransaksiPage implements OnInit {
  item;
  detailitem;
  banyakitem = 0;;
  constructor(private modalCtrl: ModalController, private db: AngularFirestore) { }

  ngOnInit() {
    console.log(this.item);
    this.getDetailItem();
  }

  getDetailItem()
  {
    this.db.collection(`Transaksi/${this.item.InvoiceID}/Item`)
    .valueChanges({idField: 'MenuID'})
    .subscribe((data:any) => {
        this.detailitem = data;
        console.log(this.detailitem)
        this.hitungitem(this.detailitem)
    });
  }

  hitungitem(detailitem)
  {
    for(let i=0; i<detailitem.length; i++)
    {
      this.banyakitem = this.banyakitem + this.detailitem[i].jumlah;
    }
    // this.banyakitem = this.detailitem.length;

  }

  close()
  {
    this.modalCtrl.dismiss();
  }

}
