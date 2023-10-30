import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { TimbreService } from 'src/app/services/timbre.service';
import { Horario, Schedule } from '../../../../../../models/horario-response';
import { finalize, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { ControllerService } from '../../../../../../services/controllers/controller.service';
import { Record } from 'src/app/models/record-reponse';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{

   subscription: Subscription= new Subscription()
  public loading:boolean=false;
  public activar:boolean=true;
  public tocar:boolean=true;
  public editar:boolean=false;
  public horari!:Schedule[];
  public record!:Record;
  recognition: any;
  isListening: boolean = false;


  constructor(private _sHorario:TimbreService,
    private _sCtr: ControllerService,
    private zone: NgZone
    ){
      this.getHorario();
    //  this.speak();
  }
  ngOnDestroy(): void {
    // this.stopRecognition();
    this.zone.run(()=>{
      this.subscription.unsubscribe();
    })
  }

  ngOnInit(): void {

    // this.startRecognition();
  }

  tocarTimbre(){
    this.zone.run(()=>{
      this.tocar=true;
     this.putHorario(1,{tocar: true});
      if(this.tocar){
  Swal.fire({
    title: 'Tocando timbre!',
    icon: 'success',
     timer: 5000,
    heightAuto:true,
    timerProgressBar: true,
    showConfirmButton: false,
    showCancelButton: false,
    backdrop:true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,

  });

      }
    })

  }
  cambiarEstado(){
    this.activar=!this.activar;
    this.putHorario(1, {activo: this.activar})

  }

  getHorario(){
    this.zone.run(()=>{
      let sub =this._sHorario.getHorarioId(1)
      .pipe(finalize(()=>{
        this.loading=true
      }))
      .subscribe({
        next: (data)=>{
          this.actualizarEstado(data);
        },
        error: ()=>{
        }
      });
      this.subscription.add(sub);
    })
  }
  putHorario(id:any, horario:any){
   this.zone.run(()=>{
   let sub= this._sHorario.putHorario(id, horario)
    .pipe(
      finalize(()=>{
      })
    )
    .subscribe({
      next:(data)=>{
        // console.table(data)
      },
      error:()=>{
      }
    });
    this.subscription.add(sub);
   })
  }
  actualizarEstado(data:Horario){
    this.activar=data?.activo;
    this.horari=data?.schedules;

  }

  cancel(event:any){

    this.editar=event;
  }
  handleButtonClick(value: Schedule[]) {
    this.horari=value;
  }
  startRecognition() {
    this.recognition.start();
  }

  stopRecognition() {
    this.recognition.stop();
  }
  speak(){
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.getHorario();

  this.recognition.continuous = true;
  this.recognition.lang = 'es';
  this.recognition.onstart = () => {
    this.isListening = true;
  };
  this.recognition.onend = () => {
    // console.log('hola');
    this.isListening = false;
    if(!this.isListening){
      this.startRecognition();
    }
  };
  this.recognition.onresult = (event: any) => {
    let results = event.results;
    for (let i = event.resultIndex; i < results.length; i++) {
      let transcript = results[i][0].transcript.toLowerCase();
      // console.log(transcript);

      if (transcript.includes('tocar')) {
        this.tocarTimbre();
        delete event.results[i][0];
        // console.log(results);
        // results=[]
      }else{
        // delete results[i][0];

      }
      // console.log(results);
    }

  };

  }
}
