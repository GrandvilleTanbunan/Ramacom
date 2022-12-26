import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, from, of } from 'rxjs';   
import { DataService } from './services/data.service';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {take , map, switchMap} from 'rxjs/operators';
import { signOut, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

// import {  } from '@firebase/auth';
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


  public user;
  public loggeduser;
  public tmpemail;
  public emailku;

  private usernameterdaftar = false;
  private userData = new BehaviorSubject(null);

  authState = new BehaviorSubject(null);

  private _statusChange$ = new Subject<string>();
  public loginStatus$ = this._statusChange$.asObservable();
  public tmpuser = [];

  public terdaftar = false;
  public cekpassword = false;

  constructor(private db: AngularFirestore, private auth: Auth, private dataService: DataService, private storage : Storage, private http: HttpClientModule, private plt: Platform, private router: Router) {
    // this.dataService.getUser().subscribe(res => {
    //   this.tmpuser = res;
    //   console.log(this.tmpuser);
    // })

    this.db.collection(`Users`).valueChanges({ idField: 'UserID' }).pipe(take(1))
    .subscribe(data => {
      this.tmpuser = data;
      console.log(this.tmpuser)
    });
  };

   isLoggedIn()
   {
      return this.currentUser != null;
   }
   isAdmin()
   {
    return this.currentUser.role == 0;
   }

   async register ({email, password}){
     try{
       this.user = await createUserWithEmailAndPassword(
         this.auth, email, password
       );
       return this.user;
     } catch (e){
       console.log(e)
       return null;
     }
   }

  async login({ username, password }) {

    let idx;
    for (let i = 0; i < this.tmpuser.length; i++) {
      if (this.tmpuser[i].username == username) {
        idx = i;
      }
    }
    if(idx){
      this.emailku = this.tmpuser[idx].email;
      this.loggeduser = username;
      this._statusChange$.next(username);
      console.log(this.emailku);
      console.log(this.loggeduser);

    }
    
    try {
      this.user = await signInWithEmailAndPassword(
        this.auth, this.emailku, password
      );
      return this.user;
    } catch (e) {
      return null;
    }

  }

   logout()
   {
     return signOut(this.auth);
   }
}
