import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivationService {
  api:string=environment.API_KEY_BD;

  constructor(
    private http: HttpClient
  ) { }

  getActivation():Observable<any>{
    return this.http.get(`${this.api}/activation.json`)
    .pipe(
      map((resp:any)=>{
        return this.createArray(resp);
      })
    );
  }
  getActivationID(id:any):Observable<any>{
    return this.http.get(`${this.api}/activation/${id}.json`)
  }
  DeletedActivationID(id:any):Observable<any>{
    return this.http.delete(`${this.api}/activation/${id}.json`)
  }
  PostActivation(obj:any):Observable<any>{
    return this.http.post(`${this.api}/activation.json`,obj);
  }
  PutActivation(id:any,obj:any):Observable<any>{
    return this.http.post(`${this.api}/activation/${id}.json`,obj);
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
