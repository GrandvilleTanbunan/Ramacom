import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject, Observable, BehaviorSubject, from, of } from 'rxjs';   
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {

  constructor(private db: AngularFirestore) { }
  tmpnotif;
  ngOnInit() {
    this.getnotif();
  }
  getnotif() {
    this.db.collection('Pemberitahuan', ref => ref.orderBy('timestamp', "desc"))
      .valueChanges({ idField: 'NotifID' }).pipe(take(1))
      .subscribe(data => {
        this.tmpnotif = data;
        console.log(this.tmpnotif);
        this.updateREAD(this.tmpnotif);
      }
      );
  }

  async updateREAD(tmpnotif)
  {
    let tmpNotifID = [];
    for(let i=0; i<tmpnotif.length; i++)
    {
      if(this.tmpnotif[i].read == "1")
      {
        tmpNotifID.push(this.tmpnotif[i].NotifID);
      }
    }
    console.log(tmpNotifID);

    for(let i=0; i<tmpNotifID.length; i++)
    {
      const UpdateRead = this.db.collection(`Pemberitahuan`).doc(`${tmpNotifID[i]}`);
    
      const res1 = await UpdateRead.update({read: 0});
    }
    
  }

}
