import { Component, OnInit } from '@angular/core';
import { Record } from 'src/app/models/record-reponse';
import { RecordService } from 'src/app/services/record.service';
import { ControllerService } from '../../../../../../services/controllers/controller.service';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
],
})
export class HomeComponent implements OnInit {
  panelOpenState = false;
  record:Record[]=[];
  recordTemp:Record[]=[];
  error:boolean=false;
  mostrar:boolean= true;
  public formu!:    FormGroup;
  constructor(
    private datePipe: DatePipe,
    private form     : FormBuilder,
    private _Srecord: RecordService,
    private _Sctr: ControllerService
    ){
    this._Sctr.leerRole()
    this.getRecords()
  }
  ngOnInit(): void {
    this.createForm();
    let date = new Date();
    // console.log(date);
    this.loadFormu(date);


  }

  getRecords(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._Srecord.getrecord()
        .subscribe({
          next: (data) => {
            this.record = data;
            this.recordTemp = data;
            // console.log(this.record);
            this.loadChart(this.record);

            this.record.sort((a:any, b:any) => {
              const dateA = new Date(a.update_date.split('/').reverse().join('/')).getTime();
              const dateB = new Date(b.update_date.split('/').reverse().join('/')).getTime();
              return (dateB - dateA);
            });
            resolve(data);
          },
          error: (err) => {
            reject(err);
            this._Sctr.showToastr_error(err?.error?.msg);
          }
        });
    });
  }
  createForm(){
    this.formu= this.form.group({
      date: [new Date(), [Validators.required],[]]
    })
  }
  loadFormu(date:any){
    this.formu.reset({
      date: date
    });
  }
  buscar(fecha: any) {
    let dat=new Date();
    let date = new Date(fecha);
    const datePattern = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/\d{4}$/;
    // console.log(date);

    // this.loadFormu(date);
    const isValidDate = (fecha:any) => {
      return datePattern.test(fecha);
    };
    if(isValidDate(fecha)){
      this.loadFormu(date);
      this.error=false;
      let org = fecha;
      let f = [];
      org = org.split('/');
      f.push(org[1], org[0], org[2]);
      org = f.join('/');
      this.mostrar=true;
      let busqueda= this.recordTemp.filter((ele: any) => {
        return ele.update_date === org;
      });
      if(busqueda.length>0){
        this.record=busqueda;
      }else{
        this.record=[];
        this.mostrar=false;
        setTimeout(() => {
          this.loadFormu(dat);
          this.record=this.recordTemp;
          this.mostrar=true;
        }, 4000);
      }
    } else{
      this.loadFormu(dat);
    }

  }

  loadChart(data:any){
    data=data.map((ele:any)=>{
      return{
        name: ele.name,
        pictureSettings: {
          src: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
        }
      }
    })
    const itemMap = new Map();

    data.forEach((item: any) => {
      const key = JSON.stringify(item);
      if (itemMap.has(key)) {
        itemMap.get(key).steps++;
      } else {
        itemMap.set(key, { ...item, steps: 1 });
      }
    });

    data = [...itemMap.values()];


    let root = am5.Root.new("cont_chart");
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingBottom: 50,
        paddingTop: 40
      })
    );

    let xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.grid.template.set("visible", false);

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        paddingTop:40,
        categoryField: "name",
        renderer: xRenderer
      })
    );

    let yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.grid.template.set("strokeDasharray", [3]);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: yRenderer
      })
    );
    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Income",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "steps",
        categoryXField: "name",
        sequencedInterpolation: true,
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          dy: -30,
          pointerOrientation: "vertical",
          labelText: "{valueY}"
        })
      })
    );

    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusTL: 10,
      maxWidth: 50,
      fillOpacity: 0.8
    });

    let currentlyHovered: any;

    series.columns.template.events.on("pointerover", function (e) {
      handleHover(e.target.dataItem);
    });

    series.columns.template.events.on("pointerout", function (e) {
      handleOut();
    });

    function handleHover(dataItem:any) {
      if (dataItem && currentlyHovered != dataItem) {
        handleOut();
        currentlyHovered = dataItem;
        let bullet = dataItem.bullets[0];
        bullet.animate({
          key: "locationY",
          to: 1,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }
    }

    function handleOut() {
      if (currentlyHovered) {
        let bullet = currentlyHovered.bullets[0];
        bullet.animate({
          key: "locationY",
          to: 0,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic)
        });
      }
    }

    let circleTemplate = am5.Template.new({});

    series.bullets.push(function (root, series, dataItem) {
      let bulletContainer = am5.Container.new(root, {});
      var circleTemplate = am5.Template.new({},);
      let circle = bulletContainer.children.push(
        am5.Circle.new(
          root,
          {
            radius: 34
          },
          // circleTemplate
        )
      );

      let maskCircle = bulletContainer.children.push(
        am5.Circle.new(root, { radius: 27 })
      );

      // only containers can be masked, so we add image to another container
      let imageContainer = bulletContainer.children.push(
        am5.Container.new(root, {
          mask: maskCircle
        })
      );

      let image = imageContainer.children.push(
        am5.Picture.new(root, {
          templateField: "pictureSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 60,
          height: 60
        })
      );

      return am5.Bullet.new(root, {
        locationY: 0,
        sprite: bulletContainer
      });
    });

    // heatrule
    series.set("heatRules", [
      {
        dataField: "valueY",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: series.columns.template,
        key: "fill"
      },
      {
        dataField: "valueY",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: circleTemplate,
        key: "fill"
      }
    ]);

    series.data.setAll(data);
    xAxis.data.setAll(data);

    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    cursor.events.on("cursormoved", function () {
      let dataItem = series.get("tooltip")?.dataItem;
      if (dataItem) {
        handleHover(dataItem);
      } else {
        handleOut();
      }
    });
    chart.children.unshift(am5.Label.new(root, {
      text: "Cambios",
      fontSize: 25,
      fontWeight: "500",
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0
    }));

  }

}
