import { StockAdminPage } from './../stock-admin/stock-admin.page';
import { User } from './../auth.service';
import { Observable, of} from 'rxjs';
import { Injectable } from '@angular/core';
import { collectionData, docData, Firestore, doc, addDoc, deleteDoc} from '@angular/fire/firestore';
import { collection, orderBy, where} from '@firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { take, takeWhile, takeUntil } from 'rxjs/operators';

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
  public tmpusername;
  public loggeduser;
  public tmptransaksiaktif: any = [];
  public tmpstock = [];
  isAlive: boolean = true;
  stockkembar = false;
  

  constructor(private firestore: Firestore, private db: AngularFirestore) { 
  }

  getUser()
  {
    const UsersRef = collection(this.firestore, 'Users');
    return collectionData(UsersRef,{idField: 'UserID'});
  }

  getUsernameByEmail(email): Observable<any>
  {
    this.db.collection('Users', ref => ref.where('email', '==', `${email}`))
        .valueChanges()
        .subscribe( data => {
            this.tmpusername = data;
            console.log(this.tmpusername);
            console.log(this.tmpusername[0].username);
            this.loggeduser = this.tmpusername[0].username;
        }
        
    );
    return of(this.tmpusername);
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


  addBrand(namabrandku, loggeduser) 
  {
    this.addnotif(`${loggeduser} menambah brand '${namabrandku}'`);
    console.log(namabrandku);
    let tmpnamabrand = {
      namabrand : namabrandku
    }

    const BrandRef = collection(this.firestore, 'Brand');
    return addDoc(BrandRef, tmpnamabrand);
  }


  async addType(loggeduser, BrandID,namabrand, namatipeku, cabang, harga)
  {
    this.addnotif(`${loggeduser} menambah tipe '${namatipeku}' pada brand '${namabrand}'`)
    let tmptipe = {
      type : namatipeku,
      harga: harga
    }

    // const TypeRef = collection(this.firestore, `Brand/${BrandID}/Type`);
    // return addDoc(TypeRef, tmpnamatipe);

    const res = await this.db.collection(`Brand/${BrandID}/Type`).add(tmptipe);
    for(let i=0; i<cabang.length; i++)
    {
      this.db.collection(`Brand/${BrandID}/Type/${res.id}/stockdicabang`).doc(cabang[i].namacabang).set({
        jumlah: "0"
      })
    }

  }

  addStock(BrandID) {
    this.db.collection(`Brand/${BrandID}/Type`).doc("LA").set({
      name: "Los Angeles",
      state: "CA",
      country: "USA"
    })
  }

  async addItem(itemdetail, cabang, kategori)
  {
    console.log(itemdetail);
    let item ={
      harga: itemdetail.harga,
      nama: itemdetail.nama,
      kategori: kategori
    } 
    const res = await this.db.collection(itemdetail.kategori).add(item);
    for(let i=0; i<cabang.length; i++)
    {
      this.db.collection(`${kategori}/${res.id}/stockdicabang`).doc(cabang[i].namacabang).set({
        jumlah: "0"
      })
    }
  }

  deleteBrand(loggeduser,BrandID, namabrand)
  {
    this.addnotif(`${loggeduser} menghapus brand '${namabrand}'`)
    const TypeRef = doc(this.firestore, `Brand/${BrandID}`);
    return deleteDoc(TypeRef);
  }

  async deleteType(loggeduser, namabrand, BrandID, namatype, TypeID, tmpCabang)
  {
    this.addnotif(`${loggeduser} menghapus tipe '${namatype}' pada brand '${namabrand}'`)
    this.deletecoll(BrandID, TypeID, tmpCabang);
    const TypeRef = doc(this.firestore, `Brand/${BrandID}/Type/${TypeID}`);
    return deleteDoc(TypeRef);
    
  }

  async deleteItem(kategori, ItemID, tmpCabang)
  {
    // this.addnotif(`${loggeduser} menghapus tipe '${namatype}' pada brand '${namabrand}'`)
    this.deletecollKategori(kategori, ItemID, tmpCabang);
    const TypeRef = doc(this.firestore, `${kategori}/${ItemID}`);
    return deleteDoc(TypeRef);
  }

  async deletecoll(BrandID, TypeID, tmpCabang)
  {
    console.log(tmpCabang);
    for(let i=0; i<tmpCabang.length; i++)
    {
      // const TypeRef = doc(this.firestore, `Brand/${BrandID}/Type/${TypeID}/stockdicabang/${tmpCabang[i].namacabang}`);
      // return deleteDoc(TypeRef);

      const res = await this.db.collection(`Brand/${BrandID}/Type/${TypeID}/stockdicabang`).doc(tmpCabang[i].namacabang).delete();
    }
    
  }

  async deletecollKategori(kategori, ItemID, tmpCabang)
  {
    console.log(tmpCabang);
    for(let i=0; i<tmpCabang.length; i++)
    {
      // const TypeRef = doc(this.firestore, `Brand/${BrandID}/Type/${TypeID}/stockdicabang/${tmpCabang[i].namacabang}`);
      // return deleteDoc(TypeRef);

      const res = await this.db.collection(`${kategori}/${ItemID}/stockdicabang`).doc(tmpCabang[i].namacabang).delete();
    }
    
  }

  async EditHarga(detailItem, HargaBaru, kategori)
  {
    console.log("Detail item: ", detailItem);
    console.log("harga baru: ", HargaBaru);
    console.log("Kategori: ", kategori);

    const UpdateHarga = this.db.collection(`${kategori}`).doc(`${detailItem.ID}`);
    
    const res1 = await UpdateHarga.update({harga: HargaBaru});
    
  }

  async EditHargaHp(IDBrand, HargaBaru, kategori, detailItem)
  {
    console.log("Detail Item: ", detailItem)
    console.log("ID brand: ", IDBrand);
    console.log("harga baru: ", HargaBaru);
    console.log("Kategori: ", kategori);

    const UpdateHarga = this.db.collection(`Brand/${IDBrand}/Type`).doc(`${detailItem.TypeID}`);
    
    const res1 = await UpdateHarga.update({harga: HargaBaru});
    
  }

  HapusKategori(data)
  {
    console.log(data)
    const TypeRef = doc(this.firestore, `Kategori/${data.CategoryID}`);
    return deleteDoc(TypeRef);
  }

  addnotif(isinotif: string)
  {
    moment.locale('id')
    let tmpnotif = {
      judul : isinotif,
      tanggal: moment().format('L'),
      hari: moment().format('dddd'),  
      waktu: moment().format('LTS'),
      timestamp: moment().format(),
      read: 1
    }

    const BrandRef = collection(this.firestore, 'Pemberitahuan');
    return addDoc(BrandRef, tmpnotif);
  }

  getstockdicabang(selectedbrand, tmptype)
  {
    this.tmpstock = [];
    // this.stockkembar = false;
    for (let i = 0; i < tmptype.length; i++) {
      console.log(tmptype[i].type);
      let sub = this.db.collection(`Brand/${selectedbrand}/Type/${tmptype[i].TypeID}/stockdicabang`)
        .valueChanges({ idField: 'CabangID' })
        // .pipe(take(1))
        .subscribe(data => {
          console.log(data)
          console.log(this.tmpstock)
            if(this.tmpstock.length == 0)
            {
              console.log("masuk if")
              this.tmpstock.push({ type: tmptype[i].type, data });
            }
            else
            {
              console.log("masuk else");
              for(let j=0; j<this.tmpstock.length; j++)
              {
                // console.log(this.tmpstock[j].type)
                // console.log(tmptype[i].type)

                if(tmptype[i].type == this.tmpstock[j].type)
                {
                  console.log("Masuk if stock kembar")
                  this.stockkembar == true
                  console.log(this.stockkembar)

                }
              }
              console.log(this.stockkembar)
              if(this.stockkembar == false)
              {
                console.log("Masuk if stock TIDAK kembar")

                this.tmpstock.push({ type: tmptype[i].type, data });
              }
              else
              {
                console.log("masuk if stock KEMBAR ELSE")
              }
            }
          
        });
      console.log(this.tmpstock);

      if(this.tmptype.length == i+1)
      {
        // masukstock = false;
        sub.unsubscribe();
      }
    }
    return this.tmpstock;
  }

}
