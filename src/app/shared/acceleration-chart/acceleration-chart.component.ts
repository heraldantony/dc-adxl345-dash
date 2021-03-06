import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-acceleration-chart',
  templateUrl: './acceleration-chart.component.html',
  styleUrls: ['./acceleration-chart.component.scss'],
encapsulation: ViewEncapsulation.None
})
export class AccelerationChartComponent implements OnInit {

 @ViewChild('accelerationchart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  private margin: any = { top: 20, bottom: 20, left: 40, right: 40};
  private chart: any;
  private line: any;
   @Input() private showXValues: boolean = true;
   @Input() private showYValues: boolean = true;
   @Input() private showZValues: boolean = true;
  private acceleration: any;
   private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private zScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(()=>{
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
    }, 1);
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  createChart() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

     console.log(this.data);
    // chart plot area
    this.chart = svg.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    const xDomain = d3.extent(this.data[0].values, function(d:any) { return +d.time; });
    const yDomain = [
    d3.min(this.data, function(c) { return d3.min(c.values, function(d:any) { return +d.acceleration; }); }),
    d3.max(this.data, function(c) { return d3.max(c.values, function(d:any) { return +d.acceleration; }); })
  ];


    // create scales
    this.xScale = d3.scaleLinear().domain(xDomain).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);
    this.zScale = d3.scaleOrdinal(d3.schemeCategory10);
    this.line = d3.line()
    .curve(d3.curveBasis)
    .x((d:any) => { return this.xScale(+d.time); })
    .y((d:any) => { return this.yScale(+d.acceleration); });

    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Acceleration (g)");

    this.acceleration = this.chart.selectAll(".acceleration")
    .data(this.data)
    .enter().append("g")
      .attr("class", "acceleration");

  this.acceleration.append("path")
      .attr("class", "line")
      .attr("d", (d) => { return this.line(d.values); })
      .style("stroke", (d) => { return this.zScale(d.id); })
      .style("fill", "none"); //fill doesn't seem to get picked up fro

  this.acceleration.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", (d) => { return "translate(" + this.xScale(d.value.time) + "," + this.yScale(d.value.acceleration) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "30px sans-serif")
      .style("color", "white")
      .text(function(d) { return d.id; });

  }

  updateChart() {
  console.log(this.data);
   var newData = []
  
    if(this.showXValues) newData.push(this.data[0]);
  if(this.showYValues) newData.push(this.data[1]);
if(this.showZValues) newData.push(this.data[2]);
if(!this.showXValues && !this.showYValues && !this.showZValues) newData.push(this.data[0]);

  const xDomain = d3.extent(newData[0].values, function(d:any) { return +d.time; });
    const yDomain = [
    d3.min(newData, function(c) { return d3.min(c.values, function(d:any) { return +d.acceleration; }); }),
    d3.max(newData, function(c) { return d3.max(c.values, function(d:any) { return +d.acceleration; }); })
  ];
    this.xScale.domain(xDomain);
   this.yScale.domain(yDomain);

     this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    /*
    this.chart.selectAll(".acceleration")
    .data(this.data).transition();
    
       this.chart.select(".line")   // change the line
            .transition(750)
      .attr("d", (d) => {
      return  this.line(d.values);
      })
      .style("stroke", (d) => { return this.zScale(d.id); });
    */
    //remove and recreate chart for now
    this.acceleration.selectAll("*").remove();
    
    this.chart.selectAll(".acceleration")
    .data(newData)
    .enter().append("g")
      .attr("class", "acceleration");
 

  this.acceleration.append("path")
      .attr("class", "line")
      .attr("d", (d) => { return this.line(d.values); })
      .style("fill", "none")
      .style("stroke", (d) => { return this.zScale(d.id); });

  this.acceleration.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", (d) => { return "translate(" + this.xScale(d.value.time) + "," + this.yScale(d.value.acceleration) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "30px sans-serif")
      .style("color", "white")
      .text(function(d) { return d.id; });
}

}
