import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Stock', url: '/stock-admin', icon: '/assets/images/stock.png' },
    { title: 'Penjualan', url: '/penjualan-admin', icon: '/assets/images/selling.png' },
    { title: 'Pembelian', url: '/pembelian-admin', icon:'/assets/images/buy.png' },
  ];

  public setting = [
    { title: 'Pengaturan', url: '/home/Stock', icon: '/assets/images/setting.png' },
    { title: 'Logout', url: '/home/Stock', icon: '/assets/images/logout.png' },
  ]
  
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor() {}
}
