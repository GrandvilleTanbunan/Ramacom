import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-transaksi-component',
  templateUrl: './transaksi-component.component.html',
  styleUrls: ['./transaksi-component.component.scss'],
})
export class TransaksiComponentComponent implements OnInit {
  name: string;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

}
