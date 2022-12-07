import { Component, OnInit } from '@angular/core';
// import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-penjualan-admin',
  templateUrl: './penjualan-admin.page.html',
  styleUrls: ['./penjualan-admin.page.scss'],
})
export class PenjualanAdminPage implements OnInit {

  public tmpselectedDate = new Date().toISOString();
  public selectedDate
  constructor() { }

  ngOnInit() {
  }

  public PilihTanggal(): void {
    console.log(this.tmpselectedDate);
    // this.selectedDate = format(parseISO(dateFromIonDatetime), 'MMM d, yyyy');
    
  }

}
