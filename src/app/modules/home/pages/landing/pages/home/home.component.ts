import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TimbreService } from 'src/app/services/timbre.service';
import { Horario, Schedule } from '../../../../../../models/horario-response';
import { finalize, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ControllerService } from '../../../../../../services/controllers/controller.service';
import { Record, DatosProcesados } from 'src/app/models/record-reponse';
import { RecordService } from 'src/app/services/record.service';
import { dumpService } from 'src/app/services/dump.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  loading:boolean = false;
  private Subscriptions:Subscription= new Subscription();
  chartData:Record[]=[];
  chartDataProcesada:DatosProcesados[]=[];
  constructor(
    private ngZone:NgZone,
    private _SD:dumpService,
    private controllerService:ControllerService
  ) {

  }
  ngOnInit(): void {
    this.getchart();
  }
  ngOnDestroy(): void {
    this.ngZone.run(()=>{
      this.Subscriptions.unsubscribe();
    })
  }

  getchart(){
   this.ngZone.run(()=>{
    this.loading=false;
   let sub= this._SD.getdump()
   .pipe(
    finalize(()=>{
      this.loading=true;
    })
   )
   .subscribe((res:Record[])=>{

    this.chartData=res;
    this.chartDataProcesada=this.procesarDatos(res).sort();
 console.log(this.chartData);
 console.log(this.chartDataProcesada);
//  this.


   })
    this.Subscriptions.add(sub);
   });
  }
   procesarDatos(datos: Record[]): DatosProcesados[] {
    const datosUnicos: { [key: string]: { datos: Record[]; contador: number } } = {};
    datos.forEach((dato) => {
        const dia = dato.dia;
        if (!datosUnicos[dia]) {
            datosUnicos[dia] = {
                datos: [dato],
                contador: 1,
            };
        } else {
            datosUnicos[dia].datos.push(dato);
            datosUnicos[dia].contador += 1;
        }
    });
    const resultado: DatosProcesados[] = Object.keys(datosUnicos).map((dia) => {
        return {
            dia: dia,
            datos: datosUnicos[dia].datos,
            contador: datosUnicos[dia].contador,
        };
    })
    return resultado;
}
 compareDays = (a: any, b:any) => {
  const dayA = a.dia.toUpperCase(); // Convert to uppercase for case-insensitive comparison
  const dayB = b.dia.toUpperCase();

  if (dayA < dayB) {
    return -1;
  }
  if (dayA > dayB) {
    return 1;
  }
  return 0;
}


}
