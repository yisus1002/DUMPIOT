import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
// import * as am5percent from "@amcharts/amcharts5/charts/percent";
// import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-chart-record-category',
  templateUrl: './chart-record-category.component.html',
  styleUrls: ['./chart-record-category.component.scss']
})
export class ChartRecordCategoryComponent implements OnInit {

  @Input() data: any[] = [];;

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'].currentValue){
      this.createchart(changes['data'].currentValue);
    }
  }
  createchart(data:any){
   // Create root element
const root = am5.Root.new("category");

// Set themes
root.setThemes([am5themes_Animated.new(root)]);

const container: am5.Container = root.container.children.push(
  am5.Container.new(root, {
    width: am5.p100,
    height: am5.p100,
    layout: root.horizontalLayout
  })
);

// Create main chart
const chart: am5percent.PieChart = container.children.push(
  am5percent.PieChart.new(root, {
    tooltip: am5.Tooltip.new(root, {})
  })
);

// Create series
const series: am5percent.PieSeries = chart.series.push(
  am5percent.PieSeries.new(root, {
    valueField: "contador",
    categoryField: "dia",
    alignLabels: false
  })
);

series.labels.template.setAll({
  textType: "circular",
  radius: 4
});
series.ticks.template.set("visible", false);
series.slices.template.set("toggleKey", "none");

// add events
series.slices.template.events.on("click", function(e) {
  selectSlice(e.target);
});

// Create sub chart
const subChart: am5percent.PieChart = container.children.push(
  am5percent.PieChart.new(root, {
    radius: am5.percent(50),
    tooltip: am5.Tooltip.new(root, {})
  })
);

// Create sub series
const subSeries: am5percent.PieSeries = subChart.series.push(
  am5percent.PieSeries.new(root, {
    valueField: "contador",
    categoryField: "dia"
  })
);

subSeries.data.setAll([
  { category: "LUNES", value: 0 },
  { category: "MARTES", value: 0 },
  { category: "MIERCOLES", value: 0 },
  { category: "JUEVES", value: 0 },
  { category: "VIERNES", value: 0 },
  { category: "SABADO", value: 0 },
  { category: "DOMINGO", value: 0 }
]);
subSeries.slices.template.set("toggleKey", "none");

let selectedSlice: any;

series.on("startAngle", function() {
  updateLines();
});

container.events.on("boundschanged", function() {
  root.events.once("frameended", function() {
    updateLines();
   })
});

function updateLines() {
  if (selectedSlice) {
    const startAngle = selectedSlice.get("startAngle");
    const arc = selectedSlice.get("arc");
    const radius = selectedSlice.get("radius");

    const x00 = radius * am5.math.cos(startAngle);
    const y00 = radius * am5.math.sin(startAngle);

    const x10 = radius * am5.math.cos(startAngle + arc);
    const y10 = radius * am5.math.sin(startAngle + arc);

    const subRadius = subSeries.slices.length > 0 ? subSeries.slices.getIndex(0)?.get("radius") ?? 0 : 0;
    const x01 = 0;
    const y01 = -subRadius;

    const x11 = 0;
    const y11 = subRadius;

    const point00 = series.toGlobal({ x: x00, y: y00 });
    const point10 = series.toGlobal({ x: x10, y: y10 });

    const point01 = subSeries.toGlobal({ x: x01, y: y01 });
    const point11 = subSeries.toGlobal({ x: x11, y: y11 });

    line0.set("points", [point00, point01]);
    line1.set("points", [point10, point11]);
  }
}

// lines
const line0: am5.Line = container.children.push(
  am5.Line.new(root, {
    position: "absolute",
    stroke: root.interfaceColors.get("text"),
    strokeDasharray: [2, 2]
  })
);
const line1: am5.Line = container.children.push(
  am5.Line.new(root, {
    position: "absolute",
    stroke: root.interfaceColors.get("text"),
    strokeDasharray: [2, 2]
  })
);

  series.data.setAll(data);

function selectSlice(slice: any) {
  selectedSlice = slice;
  const dataItem = slice.dataItem;
  const dataContext = dataItem.dataContext;

  if (dataContext) {
    let i = 0;
    subSeries.data.each(function(dataObject) {
      const dataObj = dataContext.datos[i];
      if(dataObj){
          if(!subSeries.dataItems[i].get("visible")){
              subSeries.dataItems[i].show();
          }
          subSeries.data.setIndex(i, dataObj);
      }
      else{
          subSeries.dataItems[i].hide();
      }

      i++;
    });
  }

  const middleAngle = slice.get("startAngle") + slice.get("arc") / 2;
  const firstAngle = series.dataItems[0]?.get("slice")?.get("startAngle");

  if (firstAngle !== undefined) {
    series.animate({
      key: "startAngle",
      to: firstAngle - middleAngle,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic)
    });
    series.animate({
      key: "endAngle",
      to: firstAngle - middleAngle + 360,
      duration: 1000,
      easing: am5.ease.out(am5.ease.cubic)
    });
  }
}

container.appear(1000, 10);

series.events.on("datavalidated", function() {
  selectSlice(series.slices.getIndex(0));
});
  }
}
