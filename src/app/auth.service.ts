import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, from, of } from 'rxjs';   
import { DataService } from './services/data.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {take , map, switchMap} from 'rxjs/operators';
export interface User {
  name: string;
  role: number;
}

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;


  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  authState = new BehaviorSubject(null);

  private _statusChange$ = new Subject<string>();
  public loginStatus$ = this._statusChange$.asObservable();
  public tmpuser = [];

  public terdaftar = false;
  public cekpassword = false;

  constructor(private dataService: DataService, private storage : Storage, private http: HttpClientModule, private plt: Platform, private router: Router) {
    this.dataService.getUser().subscribe(res => {
      this.tmpuser = res;
      console.log(this.tmpuser);
    })
  };


  login(name: string, pw: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.tmpuser.length; i++) {
        if (name == this.tmpuser[i].username) {
          this.terdaftar = true;
          if (pw == this.tmpuser[i].password) {
            this.cekpassword = true;
          }
          else {
            this.cekpassword = false;
          }
        }
      }

      if (this.terdaftar == true && this.cekpassword == true) {
        this.currentUser = {
          name: name,
          role: 0
        }
        resolve(true);
        this._statusChange$.next(name);
      }

      if (this.terdaftar == true && this.cekpassword == false) {
        resolve(false);
      }
      if (this.terdaftar == false) {
        resolve(false);
      }
    });
  }

   isLoggedIn()
   {
      return this.currentUser != null;
   }

   logout()
   {
    return this.currentUser = null;
   }

   isAdmin()
   {
    return this.currentUser.role == 0;
   }
}
