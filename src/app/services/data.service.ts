import { User } from './../auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { collectionData, docData, Firestore, doc, addDoc } from '@angular/fire/firestore';
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

  // getUserbyID(id): Observable<Users>
  // {
  //   const UserDocRef = doc(this.firestore, `Users/${id}`);
  //   return docData(UserDocRef, {idField: 'UserID'}) as Observable<Users>;
  // }

  // addUser(Users: Users) 
  // {
  //   const UsersRef = collection(this.firestore, 'Users');
  //   return collectionData(UsersRef, Users);
  // }

  // deleteUser(Users: Users)
  // {

  // }
}
