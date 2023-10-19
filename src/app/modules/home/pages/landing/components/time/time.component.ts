import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5 from '@amcharts/amcharts5';
import * as am5radar from "@amcharts/amcharts5/radar";
import * as am5xy from '@amcharts/amcharts5/xy';
@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit, AfterViewInit{
  h:any;
  m:any;
  s:any;
  session:any;
  time:any;
  deg:number = 6;

  constructor(
  ){}
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
    // this.showTime();
    this.createReloj();
  }


   showTime() {
    let date = new Date();
    this.h = date.getHours(); // 0 - 23
    this.m = date.getMinutes(); // 0 - 59
    this.s = date.getSeconds(); // 0 - 59

    this.h = (this.h < 10) ? "0" + this.h : this.h;
    this.m = (this.m < 10) ? "0" + this.m : this.m;
    this.s = (this.s < 10) ? "0" + this.s : this.s;

    let time = this.h + ":" + this.m + ":" + this.s ;
    this.time=  time
    setTimeout(() => {
      this.showTime();
    }, 1000);
  }

createReloj(){
  let root = am5.Root.new("chartdiv");

  root.setThemes([
    am5themes_Animated.new(root)
  ]);
  let chart = root.container.children.push(am5radar.RadarChart.new(root, {
    panX: false,
    panY: false
  }));
  let axisRenderer = am5radar.AxisRendererCircular.new(root, {
    innerRadius: -10,
    strokeOpacity: 1,
    strokeWidth: 1
  });
  
  let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
    maxDeviation: 0,
    min: 0,
    max: 12,
    strictMinMax: true,
    renderer: axisRenderer,
    maxPrecision: 0
  }));
  
  // hides 0 value
  axisRenderer.labels.template.setAll({
    minPosition: 0.02,
    textType: "adjusted",
    inside: true,
    radius: 25
  });
  axisRenderer.grid.template.set("strokeOpacity", 1);

  let hourDataItem = xAxis.makeDataItem({});
  
  let hourHand = am5radar.ClockHand.new(root, {
    radius: am5.percent(50),
    topWidth: 1,
    bottomWidth: 10,
    pinRadius: 2,
    layer:5
  })
  
  hourDataItem.set("bullet", am5xy.AxisBullet.new(root, {
    sprite: hourHand
  }));
  
  xAxis.createAxisRange(hourDataItem);
  
  hourDataItem.get("grid")?.set("visible", false);
  
  // minutes
  let minutesDataItem = xAxis.makeDataItem({});
  
  let minutesHand = am5radar.ClockHand.new(root, {
    radius: am5.percent(80),
    topWidth: 1,
    bottomWidth: 5,
    pinRadius: 7,
    layer:5
  })
  
  minutesDataItem.set("bullet", am5xy.AxisBullet.new(root, {
    sprite: minutesHand
  }));
  
  xAxis.createAxisRange(minutesDataItem);
  
  minutesDataItem.get("grid")?.set("visible", false);
  
  // seconds
  let secondsDataItem = xAxis.makeDataItem({});
  
  let secondsHand = am5radar.ClockHand.new(root, {
    radius: am5.percent(80),
    topWidth: 1,
    bottomWidth: 3,
    pinRadius: 3,
    layer:5
  })
  
  secondsHand.hand.set("fill", am5.color(0xff0000));
  secondsHand.pin.set("fill", am5.color(0xff0000));
  
  secondsDataItem.set("bullet", am5xy.AxisBullet.new(root, {sprite: secondsHand} ) );
  
  xAxis.createAxisRange(secondsDataItem);
  
  secondsDataItem.get("grid")?.set("visible", false);
  
  
  
  setInterval(function() {
    updateHands(300)
  }, 1000);
  
  function updateHands(duration:any) {
    // get current date
    let date = new Date();
    let hours = date.getHours();
    
    if(hours > 12){
      hours -= 12;
    }  
    
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
  
    // set hours
    hourDataItem.set("value", hours + minutes / 60 + seconds / 60 / 60);
    // set minutes
    minutesDataItem.set("value", 12 * (minutes + seconds / 60) / 60);
    // set seconds
    let current:any = secondsDataItem.get("value");
    let value = 12 * date.getSeconds() / 60;
    // otherwise animation will go from 59 to 0 and the hand will move backwards
    if (value == 0) {
      value = 11.999;
    }
    // if it's more than 11.99, set it to 0
    if (current > 11.99) {
      current = 0;
    }
    secondsDataItem.animate({
      key: "value",
      from: current,
      to: value,
      duration: duration
    });
  }
  
  updateHands(0);
  
  // Make stuff animate on load
  chart.appear(1000, 100);
  
  // update on visibility
  document.addEventListener("visibilitychange", function() {
    updateHands(0)
  });
}


}
