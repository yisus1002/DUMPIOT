import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Record } from '../models/record-reponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordService {


  // api:string=enviro;
  api:string=environment.API_KEY_BD;

  constructor(private http: HttpClient) { }


  getrecord():Observable<Record[]>{
    return this.http.get<Record[]>(`${this.api}/record.json`)
    .pipe(
      map((resp:any)=>{
        return this.createArray(resp);
      })
    );
  }

  getrecordId(id:any):Observable<Record>{
    return this.http.get<any>(`${this.api}/record/${id}.json`);
  }

  putrecord(record:Record):Observable<Record>{

    const recordTmp={
      ...record
    }
    delete recordTmp?.id;
    return this.http.put<any>(`${this.api}/record/${record?.id}.json`,recordTmp)
  }

  postrecord(record:Record):Observable<Record>{
    return this.http.post<Record>(`${this.api}/record.json`, record)
    .pipe(
      map((resp:any)=>{
        record.id = resp?.name;
        return record;
      }),
    );
  }
  deleterecordId(id:any):Observable<any>{
    return this.http.delete<any>(`${this.api}/record/${id}.json`);
  }

  private createArray(recordObj:any):Record[] {
    const records:Record[]=[];
    if(recordObj ===null){return [];};
    Object.keys(recordObj).forEach((key:any)=>{
      const record:Record = recordObj[key];
      record.id=key;

      records.push(record);
    })
    return records;
  }

}
