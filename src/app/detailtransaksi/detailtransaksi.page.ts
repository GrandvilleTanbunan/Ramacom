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
    });
  }

  close()
  {
    this.modalCtrl.dismiss();
  }

}
