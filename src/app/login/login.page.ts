import { DataService } from './../services/data.service';
import { User, AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  name: string;
  pw: string;
  public loggeduser;
  // user ={
  //   name:'',
  //   pw:''
  user = [];

  constructor(private loadingController: LoadingController, private router: Router, private fb: FormBuilder, private menuCtrl: MenuController, private authService: AuthService, private navCtrl: NavController, private alertCtrl: AlertController, private dataService: DataService) {

   }

  //  get email()
  //  {
  //    return this.credentials.get('email');
  //  }

  //  get password() {
  //    return this.credentials.get('password');
  //  }

  ngOnInit() {
    // this.credentials = this.fb.group({
    //   email:['', [Validators.required, Validators.email]],
    //   password: ['', [Validators.required, Validators.minLength(5)]]
    // });

    this.credentials = this.fb.group({
      username:['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authService.register(this.credentials.value);

    await loading.dismiss();

    if(user) {  
      this.router.navigateByUrl('/stock-admin', {replaceUrl: true});
    }else{
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authService.login(this.credentials.value);

    await loading.dismiss();

    if(user) {
      console.log("ada usernya");
      this.router.navigateByUrl('/stock-admin', {replaceUrl: true});
      this.menuCtrl.enable(true);
    }else{
      this.showAlert('Login Gagal', 'Silahkan Cek Username/Password!');
    }
  }

  async showAlert(header, message){
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }

}
