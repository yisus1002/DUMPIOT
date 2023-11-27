import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Record } from '../models/record-reponse';

@Injectable({
  providedIn: 'root'
})
export class DumpfirebaseService {

  Record: Record[] = [];
  private itemsCollection: AngularFirestoreCollection<any>;


  constructor(private afs: AngularFirestore,

    ) {
      this.itemsCollection = this.afs.collection<any>('dump');
     }

    //  getData(): Observable<DocumentChangeAction<any>[]> {
    //   return this.itemsCollection.snapshotChanges();
    // }
}
