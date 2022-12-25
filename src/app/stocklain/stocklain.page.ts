import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { EdithargaPage } from '../editharga/editharga.page';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../services/data.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-stocklain',
  templateUrl: './stocklain.page.html',
  styleUrls: ['./stocklain.page.scss'],
})
export class StocklainPage implements OnInit {
  tmpKategori = [];
  selectedKategori;
  selectedKategori_TambahItem = "";
  tmpItemBaru = "";
  tmpHargaBaru;
  pilikategoritambahtipe = false;
  masukannamaitem = false;
  masukkanharga = false;
  isSubmitted = false;
  ionicForm: FormGroup;

  constructor(public formBuilder: FormBuilder, private modalCtrl: ModalController, private db: AngularFirestore) { }

  ngOnInit() {
    this.getKategori();
    this.ionicForm = this.formBuilder.group({
      kategori: ['', [Validators.required]],
      item: ['', [Validators.required, Validators.minLength(2)]],
      harga:['', [Validators.required]]
    })
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

  get errorControl() {
    return this.ionicForm.controls;
  }

  SaveItem()
  {
    // if(this.selectedKategori_TambahItem == "" && this.tmpItemBaru != "")
    // {
    //   console.log("brand belum terpilih dan tipe sudah");
    //   this.pilikategoritambahtipe = true;
    //   this.masukannamaitem = false;
    //   this.masukkanharga = true;

    // }
    // else if (this.selectedKategori_TambahItem != "" && this.tmpItemBaru == "") {
    //   // console.log(this.tmpTypeBaru);
    //   console.log("brand sudah terpilih dan tipe belum");

    //   this.pilikategoritambahtipe = false;
    //   this.masukannamaitem = true;
    //   this.masukkanharga = true;

    // }
    // else if(this.selectedKategori_TambahItem == "" && this.tmpItemBaru == "")
    // {
    //   console.log("brand dan tipe belum terpilih");
    //   this.masukannamaitem = true;
    //   this.pilikategoritambahtipe = true;
    //   this.masukkanharga = true;

    // }
    // else if(this.tmpHargaBaru == undefined)
    // {
    //   this.masukannamaitem = false;
    //   this.pilikategoritambahtipe = false;
    //   this.masukkanharga = true;
    // }
    console.log("test")

    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      console.log(this.ionicForm.value)
    }

  }

  Dismissmodal()
  {
    console.log("masuk sini")
    this.isSubmitted = false;

    this.modalCtrl.dismiss();
    this.selectedKategori_TambahItem = "";
    this.tmpItemBaru = "";
    this.tmpHargaBaru = undefined;
  }


}
