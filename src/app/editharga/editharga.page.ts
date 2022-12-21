import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editharga',
  templateUrl: './editharga.page.html',
  styleUrls: ['./editharga.page.scss'],
})
export class EdithargaPage implements OnInit {
  detailitem;
  hargabaru;
  constructor() { }

  ngOnInit() {
    console.log(this.detailitem);
  }

}
