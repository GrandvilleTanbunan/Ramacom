import { User, AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  name: string;
  pw: string;
  user ={
    name:'',
    pw:''
  }
  constructor(private authService: AuthService, private navCtrl: NavController, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async loginUser(){
    this.authService.login(this.name, this.pw).then(async success =>{
      if(success){
        this.navCtrl.navigateRoot('stock-admin');
      }
      else{
        let alert = await this.alertCtrl.create({
          header: 'Login gagal',
          message: 'Silahkan cek username/password',
          buttons:['OK']
        });
        await alert.present();

      }

    });

  }

}
