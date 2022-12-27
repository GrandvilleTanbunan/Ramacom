import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


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
  getnotif()
  {
    this.db.collection('Pemberitahuan', ref => ref.orderBy('timestamp', "desc"))
    .valueChanges({ idField: 'NotifID' })
    .subscribe( data => {
        this.tmpnotif = data;   
        console.log(this.tmpnotif);
    }
);
  }

}
