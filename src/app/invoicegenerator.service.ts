import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class InvoicegeneratorService {
  ctrinvoice =0;
  finalinvoice;
  loggeduser;
  constructor(private authService: AuthService) {
    moment.locale('id'); 
    this.authService.loginStatus$.subscribe(user => {
      this.loggeduser = user;
      // console.log("logged user: ", this.loggeduser);
    });
   }

  generateinvoice()
  {
    this.ctrinvoice++;
    const today = moment().format('YYMMDD');
    const waktu = moment().format('LTSMS')
    this.finalinvoice = this.loggeduser+ - + today + "." + waktu;
    return this.finalinvoice;
  }
}
