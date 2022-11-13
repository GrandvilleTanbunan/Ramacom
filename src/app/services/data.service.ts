import { StockAdminPage } from './../stock-admin/stock-admin.page';
import { User } from './../auth.service';
import { Observable, of} from 'rxjs';
import { Injectable } from '@angular/core';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc} from '@angular/fire/firestore';
import { collection, orderBy, where} from '@firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

export interface Users {
  id?: string;
  username: string;
  password: string;
}




@Injectable({
  providedIn: 'root'
})
export class DataService {

  items: Observable<any[]>;
  public tmpbrand: any = [];
  public tmptype: any = [];
  

  constructor(private firestore: Firestore, private db: AngularFirestore) { 
  }

  getUser()
  {
    const UsersRef = collection(this.firestore, 'Users');
    return collectionData(UsersRef,{idField: 'UserID'});
  }
  

  getBrand()
  {
    this.db.collection('Brand', ref => ref.orderBy('namabrand', 'asc'))
        .valueChanges()
        .subscribe( data => {
            this.tmpbrand = data;
        }
        
    );
    return this.tmpbrand;
    
  }


  getType(BrandID): Observable<any>
  {
    // console.log(BrandID);
    // const TypeRef = collection(this.firestore, `Brand/${BrandID}/Type`);
    // return collectionData(TypeRef,{idField: 'TypeID'});

    this.db.collection(`Brand/${BrandID}/Type`, ref => ref.orderBy('type', 'asc'))
        .valueChanges()
        .subscribe( data => {
            this.tmptype = data;
            console.log(this.tmptype)
            // return of(this.tmptype);
        }
        
    );
    return of(this.tmptype);

  }


  addBrand(namabrandku) 
  {
    console.log(namabrandku);
    let tmpnamabrand = {
      namabrand : namabrandku
    }

    const BrandRef = collection(this.firestore, 'Brand');
    return addDoc(BrandRef, tmpnamabrand);
    
  }

  addType(BrandID, namatipeku)
  {
    let tmpnamatipe = {
      type : namatipeku
    }

    const TypeRef = collection(this.firestore, `Brand/${BrandID}/Type`);
    return addDoc(TypeRef, tmpnamatipe);

  }

  addStock(BrandID)
  {
    this.db.collection(`Brand/${BrandID}/Type`).doc("LA").set({
      name: "Los Angeles",
      state: "CA",
      country: "USA"
  })
  }

  deleteBrand(BrandID)
  {
    const TypeRef = doc(this.firestore, `Brand/${BrandID}`);
    return deleteDoc(TypeRef);
  }

  deleteType(BrandID, TypeID)
  {
    const TypeRef = doc(this.firestore, `Brand/${BrandID}/Type/${TypeID}`);
    return deleteDoc(TypeRef);
  }
}
