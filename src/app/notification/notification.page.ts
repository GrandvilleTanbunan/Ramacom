import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Observable, BehaviorSubject, from, of } from 'rxjs';   
import { take } from 'rxjs/operators';
import * as moment from 'moment';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  @ViewChild('popover') popover;
  public tmpselectedDate = new Date().toISOString();
  public tmpselectedMonth = new Date().toISOString();
  public tmpselectedYear = new Date().toISOString();
  public tmpselectedRentangTanggal = new Date().toISOString();
  tmpfilter ="Hari ini";
  isOpen = false;
  constructor(private db: AngularFirestore) { }
  tmpnotifhariini;
  tmpallnotif;
  bulandantahunsekarang = moment().format('MM/YYYY');
  tahunsekarang = moment().format('YYYY');
  notiffinal = [];
  ngOnInit() {
    this.getallnotif();
  }
  

  getallnotif()
  {
    this.db.collection('Pemberitahuan', ref => ref.orderBy('timestamp', "desc"))
      .valueChanges({ idField: 'NotifID' }).pipe(take(1))
      .subscribe(data => {
        this.tmpallnotif = data;
        console.log(this.tmpallnotif);
        this.updateREAD(this.tmpallnotif);
        this.getnotifhariini()
      }
      );
  }

  getnotifhariini() {
    moment.locale('id');
      const formateddate = moment().format('L');
      for (let i = 0; i < this.tmpallnotif.length; i++) {
        if (formateddate == this.tmpallnotif[i].tanggal) {
          this.notiffinal.push(this.tmpallnotif[i]);
          console.log(this.notiffinal);
        }
      }
  }

  async updateREAD(tmpnotif)
  {
    let tmpNotifID = [];
    for(let i=0; i<tmpnotif.length; i++)
    {
      if(this.tmpallnotif[i].read == "1")
      {
        tmpNotifID.push(this.tmpallnotif[i].NotifID);
      }
    }
    console.log(tmpNotifID);

    if(tmpNotifID.length>0)
    {
      console.log("Masuk di tmpnotifid");

      for(let i=0; i<tmpNotifID.length; i++)
      {
        const UpdateRead = this.db.collection(`Pemberitahuan`).doc(`${tmpNotifID[i]}`);
      
        const res1 = await UpdateRead.update({read: 0});
      }
    }
    
    
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  setFilter(filter: string)
  {
    this.notiffinal = [];
    moment().locale("id");
    // console.log("Bulan & tahun sekarang: "+this.bulandantahunsekarang);
    this.tmpfilter = filter;
    // console.log(filter)
    if(this.tmpfilter == "Hari ini")
    {
      this.getnotifhariini();
    }
    else if(this.tmpfilter == "Bulan ini")
    {
      for(let i=0; i<this.tmpallnotif.length; i++){
        if(this.bulandantahunsekarang == moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('MM/YYYY'))
        {
          this.notiffinal.push(this.tmpallnotif[i]);
          // console.log(this.notiffinal);
        }
      }
    }
    else if(this.tmpfilter == "Tahun ini")
    {
      for(let i=0; i<this.tmpallnotif.length; i++){
        if(this.tahunsekarang == moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('YYYY'))
        {
          this.notiffinal.push(this.tmpallnotif[i]);
          // console.log(this.notiffinal);
        }
      }
    }
    
  }

  public PilihTanggal(): void {
    this.notiffinal = [];
    const formateddate = moment(this.tmpselectedDate).format('DD/MM/YYYY');
    console
    for (let i = 0; i < this.tmpallnotif.length; i++) {
      if (formateddate == this.tmpallnotif[i].tanggal) {
        this.notiffinal.push(this.tmpallnotif[i]);
        console.log(this.notiffinal);
      }
    }
    this.tmpfilter = formateddate;

  }

  public PilihBulan(): void {
    this.notiffinal = [];

    const formateddate = moment(this.tmpselectedMonth).format('MM/YYYY')
    console.log(formateddate);
    for (let i = 0; i < this.tmpallnotif.length; i++) {
      if (formateddate == moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('MM/YYYY')) {
        this.notiffinal.push(this.tmpallnotif[i]);
        // console.log(this.notiffinal);
      }
    }
    this.tmpfilter = moment(this.tmpselectedMonth).format('MMMM YYYY');
  }

  public PilihTahun(): void {
    this.notiffinal = [];

    const formateddate = moment(this.tmpselectedYear).format('YYYY')
    console.log(formateddate);
    for (let i = 0; i < this.tmpallnotif.length; i++) {
      if (formateddate == moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('YYYY')) {
        this.notiffinal.push(this.tmpallnotif[i]);
        // console.log(this.notiffinal);
      }
    }
    this.tmpfilter = formateddate;

  }




  public PilihRentangTanggal(): void {
    this.notiffinal = [];
    const formateddate = [];
    if (this.tmpselectedRentangTanggal.length > 0) {
      for (let i = 0; i < this.tmpselectedRentangTanggal.length; i++) {
        formateddate.push(moment(this.tmpselectedRentangTanggal[i]).format('DD/MM/YYYY'))
      }
      for (let i = 0; i < this.tmpallnotif.length; i++) {
        // console.log(this.tmpallnotif[i].tanggal)
        for (let j = 0; j < formateddate.length; j++) {
          if (formateddate[j] == this.tmpallnotif[i].tanggal) {
            this.notiffinal.push(this.tmpallnotif[i]);
            console.log(this.notiffinal);
          }
        }
      }
    }

    this.tmpfilter = "Tanggal Pilihan";

  }

}
