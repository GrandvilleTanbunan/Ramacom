import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';   
export interface User {
  name: string;
  role: number;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User;

  private _statusChange$ = new Subject<string>();
  public loginStatus$ = this._statusChange$.asObservable();

  constructor() {

   }

   login(name:string, pw: string) : Promise<boolean>
   {
      return new Promise((resolve, reject)=>{
        if(name=='admin' && pw=='12345')
        {
          this.currentUser ={
            name:name,
            role:0
          }
          resolve(true);
          this._statusChange$.next(name);
        }
        else
        {
          this.currentUser = {
            name: name,
            role: 1
          }
          resolve(false);
        }
      })
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
