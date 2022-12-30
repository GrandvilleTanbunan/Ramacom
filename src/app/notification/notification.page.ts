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
  tmpfilter ="Hari ini";
  isOpen = false;
  constructor(private db: AngularFirestore) { }
  tmpnotifhariini;
  tmpallnotif;
  bulandantahunsekarang = moment().format('MM/YYYY');
  tahunsekarang = moment().format('YYYY');
  notiffinal = [];
  ngOnInit() {
    this.getnotifhariini();
    this.getallnotif();
  }
  getnotifhariini() {
    moment.locale('id');
    const tanggalhariini=moment().format('l');

    this.db.collection('Pemberitahuan', ref => ref.where('tanggal','==',`${tanggalhariini}`).orderBy('timestamp', "desc"))
      .valueChanges({ idField: 'NotifID' }).pipe(take(1))
      .subscribe(data => {
        this.tmpnotifhariini = data;
        this.notiffinal = data;
        console.log(this.tmpnotifhariini);
        // this.updateREAD(this.tmpnotifhariini);
      }
      );
  }

  getallnotif()
  {
    this.db.collection('Pemberitahuan', ref => ref.orderBy('timestamp', "desc"))
      .valueChanges({ idField: 'NotifID' }).pipe(take(1))
      .subscribe(data => {
        this.tmpallnotif = data;
        console.log(this.tmpallnotif);
        this.updateREAD(this.tmpallnotif);
      }
      );
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
    console.log("Bulan & tahun sekarang: "+this.bulandantahunsekarang);
    this.tmpfilter = filter;
    console.log(filter)
    if(this.tmpfilter == "Hari ini")
    {
      this.notiffinal = this.tmpnotifhariini;
    }
    else if(this.tmpfilter == "Bulan ini")
    {
      for(let i=0; i<this.tmpallnotif.length; i++){
        // console.log(this.tmpallnotif[i].tanggal);
        // this.notifbulanini = moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('MM/YYYY');
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
        // console.log(this.tmpallnotif[i].tanggal);
        // this.notifbulanini = moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('MM/YYYY');
        if(this.tahunsekarang == moment(this.tmpallnotif[i].tanggal, 'dd/MM/YYYY').format('YYYY'))
        {
          this.notiffinal.push(this.tmpallnotif[i]);
          // console.log(this.notiffinal);
        }
      }
    }
    
  }


}
