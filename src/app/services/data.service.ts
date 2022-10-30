import { User } from './../auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';

export interface Users {
  id?: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore, ) { }

  getUser()
  {
    const UsersRef = collection(this.firestore, 'Users');
    return collectionData(UsersRef,{idField: 'UserID'});
  }

  getBrand()
  {
    const BrandRef = collection(this.firestore, 'Brand');
    return collectionData(BrandRef,{idField: 'BrandID'});
  }

  getType(BrandID)
  {
    console.log(BrandID);
    const TypeRef = collection(this.firestore, `Brand/${BrandID}/Type`);
    return collectionData(TypeRef,{idField: 'TypeID'});

  }

  // getUserbyID(id): Observable<Users>
  // {
  //   const UserDocRef = doc(this.firestore, `Users/${id}`);
  //   return docData(UserDocRef, {idField: 'UserID'}) as Observable<Users>;
  // }

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
