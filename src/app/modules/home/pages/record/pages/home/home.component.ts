import { Component, OnInit } from '@angular/core';
import { Record } from 'src/app/models/record-reponse';
import { RecordService } from 'src/app/services/record.service';
import { ControllerService } from '../../../../../../services/controllers/controller.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  record:Record[]=[];
  error:boolean=false;
  mostrar:boolean= true;
  constructor(
    private _Srecord: RecordService,
    private _Sctr: ControllerService
    ){
    this._Sctr.leerRole()
    this.getRecords()
  }
  ngOnInit(): void {

  }

  getRecords(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._Srecord.getrecord()
        .subscribe({
          next: (data) => {
            this.record = data;
            this.record.sort((a:any, b:any) => {
              const dateA = new Date(a.update_date.split('/').reverse().join('/')).getTime();
              const dateB = new Date(b.update_date.split('/').reverse().join('/')).getTime();
              return (dateB - dateA);
            });
            resolve(data);
          },
          error: (err) => {
            console.log(err);
            reject(err);
          }
        });
    });
  }

  buscar(fecha: any) {
    // console.log(fecha);
    const datePattern = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/\d{4}$/;

    const isValidDate = (fecha:any) => {
      return datePattern.test(fecha);
    };
    if(isValidDate(fecha)){
      let org = fecha;
      let f = [];
      org = org.split('/');
      f.push(org[1], org[0], org[2]);
      org = f.join('/');
      // console.log(org);

      this.getRecords().then(() => {
        const bs = this.record.filter((ele: any) => {
          return ele.update_date === org;
        });
        this.record = bs;
        (this.record.length>0)? this.mostrar=true:this.mostrar=false;
        // console.log(bs);
      });
      this.error=false;
    }else{
      // console.log('sdcserd');
      this.error=true;

    }

  }

}
