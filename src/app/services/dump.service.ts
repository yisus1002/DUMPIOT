import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class dumpService {
  api:string=environment.API_KEY_BD;

  constructor(
    private http: HttpClient
  ) { }

  getdump():Observable<any>{
    return this.http.get(`${this.api}/dump.json`)
    .pipe(
      map((resp:any)=>{
        return this.createArray(resp);
      })
    );
  }
  getdumpID(id:any):Observable<any>{
    return this.http.get(`${this.api}/dump/${id}.json`)
  }
  DeleteddumpID(id:any):Observable<any>{
    return this.http.delete(`${this.api}/dump/${id}.json`)
  }
  Postdump(obj:any):Observable<any>{
    return this.http.post(`${this.api}/dump.json`,obj);
  }
  Putdump(id:any,obj:any):Observable<any>{
    return this.http.post(`${this.api}/dump/${id}.json`,obj);
  }

  private createArray(recordObj:any):any[] {
    const records:any[]=[];
    if(recordObj ===null){return [];};
    Object.keys(recordObj).forEach((key:any)=>{
      const record:any = recordObj[key];
      record.id=key;

      records.push(record);
    })
    return records;
  }

}
