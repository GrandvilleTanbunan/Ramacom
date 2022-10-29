import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-add-type-modal',
  templateUrl: './add-type-modal.component.html',
  styleUrls: ['./add-type-modal.component.scss'],
})
export class AddTypeModalComponent implements OnInit {

  selectedbrand;
  public tmpbrand = [];

  constructor(private modalCtrl: ModalController, private dataService: DataService) { 
    this.getBrand();
  }

  ngOnInit() {}

  getBrand() {

    this.dataService.getBrand().subscribe(res => {
      this.tmpbrand = res;
      console.log(this.tmpbrand);

    });
  }


  dismissModal()
  {
    this.modalCtrl.dismiss();
  }

}
