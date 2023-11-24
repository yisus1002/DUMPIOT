import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';


@Component({
  selector: 'app-chart-record',
  templateUrl: './chart-record.component.html',
  styleUrls: ['./chart-record.component.scss']
})
export class ChartRecordComponent implements OnInit {
  @Input() data:any;
  constructor(){

  }
  ngOnInit(): void {
    if(this.data){
      // this.createchart(this.data);
    }
  }
ngOnChanges(changes: SimpleChanges): void {
  if(changes['data']){
    this.createchart(changes['data'].currentValue);
  }
}
  createchart(data:any){

    var root = am5.Root.new("chartdiv");
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    var chart:any = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "none",
      wheelY: "none"
    }));

    chart.zoomOutButton.set("forceHidden", true);
    var yRenderer = am5xy.AxisRendererY.new(root, {
      minGridDistance: 30
    });

    yRenderer.grid.template.set("location", 1);

    var yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0,
      categoryField: "dia",
      renderer: yRenderer,
      tooltip: am5.Tooltip.new(root, { themeTags: ["axis"] })
    }));

    var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0,
      min: 0,
      extraMax: 0.1,
      renderer: am5xy.AxisRendererX.new(root, {
        strokeOpacity: 0.1
      })
    }));
    var series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueXField: "contador",
      categoryYField: "dia",
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "left",
        labelText: "{valueX}"
      })
    }));


    // Rounded corners for columns
    series.columns.template.setAll({
      cornerRadiusTR: 5,
      cornerRadiusBR: 5,
      strokeOpacity: 0
    });

    // Make each column to be of a different color
    series.columns.template.adapters.add("fill", function(fill:any, target:any) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function(stroke:any, target:any) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });



    yAxis.data.setAll(data);
    series.data.setAll(data);
    sortCategoryAxis();

    // Get series item by category
    function getSeriesItem(category:any) {
      for (var i = 0; i < series.dataItems.length; i++) {
        var dataItem = series.dataItems[i];
        if (dataItem.get("categoryY") == category) {
          return dataItem;
        }
      }
    }

    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none",
      xAxis: xAxis,
      yAxis: yAxis
    }));


    // Axis sorting
    function sortCategoryAxis() {

      // Sort by value
      series.dataItems.sort(function(x:any, y:any) {
        return x.get("valueX") - y.get("valueX"); // descending
        //return y.get("valueY") - x.get("valueX"); // ascending
      })

      // Go through each axis item
      am5.array.each(yAxis.dataItems, function(dataItem:any) {
        // get corresponding series item
        var seriesDataItem = getSeriesItem(dataItem.get("category"));

        if (seriesDataItem) {
          // get index of series data item
          var index = series.dataItems.indexOf(seriesDataItem);
          // calculate delta position
          var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
          // set index to be the same as series data item index
          dataItem.set("index", index);
          // set deltaPosition instanlty
          dataItem.set("deltaPosition", -deltaPosition);
          // animate delta position to 0
          dataItem.animate({
            key: "deltaPosition",
            to: 0,
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic)
          })
        }
      });
      yAxis.dataItems.sort(function(x:any, y:any) {
        return x.get("index") - y.get("index");
      });
    }
    series.appear(1000);
    chart.appear(1000, 100);
  }

}
