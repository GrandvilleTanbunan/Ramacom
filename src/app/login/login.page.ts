import { DataService } from './../services/data.service';
import { User, AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  name: string;
  pw: string;
  // user ={
  //   name:'',
  //   pw:''
  user = [];

  constructor(private menuCtrl: MenuController, private authService: AuthService, private navCtrl: NavController, private alertCtrl: AlertController, private dataService: DataService) {

   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }

  async loginUser(){
    this.authService.login(this.name, this.pw).then(async success =>{
      if(success){
        if(this.name == "admin")
        {
          this.navCtrl.navigateRoot('stock-admin');
          this.menuCtrl.enable(true);

        }
        else
        {
          this.navCtrl.navigateRoot('stock-cabang');
          this.menuCtrl.enable(true);
        }
      }
      else{
        let alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: 'Check username/password',
          buttons:['OK']
        });
        await alert.present();
      }

    });

  }

}
