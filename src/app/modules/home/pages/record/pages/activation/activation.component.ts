import { Activation } from './../../../../../../models/record-reponse';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivationService } from 'src/app/services/activation.service';
import { Subscription } from 'rxjs';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { ControllerService } from 'src/app/services/controllers/controller.service';
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit, OnDestroy {
  private Subscription:Subscription=new Subscription();
  public RecordActivation:Activation[]=[];
  constructor(
    public _sActi:ActivationService,
    public zone: NgZone,
    private _sCtr: ControllerService
  ) { }
  ngOnDestroy(): void {
    this.Subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.zone.run(()=>{

    let sub= this._sActi.getActivation()
    .subscribe({
      next:(data)=>{

        this.RecordActivation=data;
        if(this.RecordActivation.length>0) {
          setTimeout(() => {
            this.loadChart(this.RecordActivation)
          }, 500);
        }
        // console.log(this.RecordActivation);
      },
      error:(err)=>{
        this._sCtr.showToastr_error(err?.error?.msg);
        // console.log(err);

      }
    })
    this.Subscription.add(sub);
  })
  }
  convertirFecha(fechaOriginal:any) {
    var partesFecha = fechaOriginal.split("/");
    var dia = partesFecha[0];
    var mes = partesFecha[1];
    var anio = partesFecha[2];
    var fechaFormateada = anio + "-" + mes + "-" + dia;
    return fechaFormateada;
  }
  sumarUnMinuto(horaOriginal:any) {
    const [hora, minuto] = horaOriginal.split(":").map(Number);
    const nuevaHora = (hora * 60 + minuto + 1) % 1440;
    return `${String(Math.floor(nuevaHora / 60)).padStart(2, "0")}:${String(nuevaHora % 60).padStart(2, "0")}`;
  }
  asignarcolor(dia:any){
    let colorsDiccionario: any = {
      Lunes:am5.Color.fromRGB(68, 249, 227 ),
      Martes:am5.Color.fromRGB(68, 249, 161 ),
      Miercoles:am5.Color.fromRGB(68, 123, 249 ),
      Jueves:am5.Color.fromRGB(211, 68, 249 ),
      Viernes:am5.Color.fromRGB(249, 73, 68 ),
      Sabado:am5.Color.fromRGB(249, 230, 68 ),
      Domingo:am5.Color.fromRGB(249, 68, 131 ),
    }
    return colorsDiccionario[dia];
  }
  loadChart(data:any){
    let root = am5.Root.new("activation__chart");
    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd HH:mm",
      dateFields: ["valueX", "openValueX"]
    });



    root.setThemes([
      am5themes_Animated.new(root)
    ]);


    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));

    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50
    }))

  data=  data.map((ele:any)=>{
      return {
        category: ele.dia,
        fromDate: `${this.convertirFecha(ele.fecha)} ${ele.hora}`,
        toDate: `${this.convertirFecha(ele.fecha)} ${this.sumarUnMinuto(ele.hora)}`,
        columnSettings: {
          fill: this.asignarcolor(ele.dia)
        }
      }
    })
    // console.log(data);



    let yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: am5xy.AxisRendererY.new(root, { inversed: true }),
        tooltip: am5.Tooltip.new(root, {
          themeTags: ["axis"],
          animationDuration: 200
        })
      })
    );

    yAxis.data.setAll([
      { category: "Lunes" },
      { category: "Martes" },
      { category: "Miercoles" },
      { category: "Jueves" },
      { category: "Viernes" },
      { category: "Sabado" },
      { category: "Domingo" },
    ]);

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {})
      })
    );

    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      openValueXField: "fromDate",
      valueXField: "toDate",
      categoryYField: "category",
      sequencedInterpolation: true
    }));

    series.columns.template.setAll({
      templateField: "columnSettings",
      strokeOpacity: 0,
      tooltipText: "{category}: {openValueX} - {valueX}"
    });

    series.data.processor = am5.DataProcessor.new(root, {
      dateFields: ["fromDate", "toDate"],
      dateFormat: "yyyy-MM-dd HH:mm"
    });
    series.data.setAll(data);

    // Add scrollbars
    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal"
    }));
    chart.children.unshift(am5.Label.new(root, {
      text: "Registro de activación",
      fontSize: 25,
      fontWeight: "500",
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0
    }));
    series.appear();
    chart.appear(1000, 100);
  }

}
