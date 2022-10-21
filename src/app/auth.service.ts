import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';   
import { DataService } from './services/data.service';
export interface User {
  name: string;
  role: number;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;

  user: Observable<any>;
  authState = new BehaviorSubject(null);

  private _statusChange$ = new Subject<string>();
  public loginStatus$ = this._statusChange$.asObservable();
  public tmpuser = [];

  public terdaftar = false;
  public cekpassword = false;

  constructor(private dataService: DataService) {
    this.dataService.getUser().subscribe(res => {
      this.tmpuser = res;
      console.log(this.tmpuser);
    })
    
  }

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
