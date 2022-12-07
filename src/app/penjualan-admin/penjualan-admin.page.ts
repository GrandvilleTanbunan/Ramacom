import { Component, OnInit } from '@angular/core';
// import { format, parseISO } from 'date-fns';
import * as moment from 'moment';

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
    this.selectedDate = moment(this.tmpselectedDate).format('DD/MM/YYYY')
    console.log(this.selectedDate);
    
  }

}
