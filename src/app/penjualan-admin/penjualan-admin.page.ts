import { Component, OnInit } from '@angular/core';
// import { format, parseISO } from 'date-fns';
import * as moment from 'moment';
import { Platform, IonRouterOutlet, AlertController, ToastController, ModalController, LoadingController   } from '@ionic/angular';
// import { ModalExampleComponent } from './modal-example.component';
import { AddTypeModalComponent } from '../add-type-modal/add-type-modal.component';
import { App } from '@capacitor/app';
import { DataService } from './../services/data.service';
import { collection } from '@firebase/firestore';
import { collectionData, docData, Firestore, doc, addDoc } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {of} from 'rxjs'
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-penjualan-admin',
  templateUrl: './penjualan-admin.page.html',
  styleUrls: ['./penjualan-admin.page.scss'],
})
export class PenjualanAdminPage implements OnInit {

  public tmpselectedDate = new Date().toISOString();
  public selectedDate
  constructor(private loadingCtrl: LoadingController, private db: AngularFirestore, private modalCtrl: ModalController, private firestore: Firestore, private toastCtrl: ToastController, private dataService: DataService, public platform: Platform, private routerOutlet: IonRouterOutlet, public alertCtrl: AlertController) {
    
   }

  ngOnInit() {
  }

  public PilihTanggal(): void {
    this.selectedDate = moment(this.tmpselectedDate).format('DD/MM/YYYY')
    console.log(this.selectedDate);
    
  }

  Dismissmodal()
  {
    this.modalCtrl.dismiss();

  }

}
