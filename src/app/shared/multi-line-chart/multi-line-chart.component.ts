import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-multi-line-chart',
  templateUrl: './multi-line-chart.component.html',
  styleUrls: ['./multi-line-chart.component.scss'],
encapsulation: ViewEncapsulation.None
})
export class MultiLineChartComponent implements OnInit {

 @ViewChild('multilinechart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any;
  private lines: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
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

    // chart plot area
    this.chart = svg.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    const xDomain = [d3.min(this.data, d => d[0]), d3.max(this.data, d => d[0])];
    var ysets=[];
    for(var i=1;i<this.data[0].length; i++) {
      ysets.push(d3.min(this.data, d => d[i]));
    } 
    var miny = d3.min(ysets);
    ysets=[];
    for(var i=1;i<this.data[0].length; i++) {
      ysets.push(d3.max(this.data, d => d[i]));
    } 
    var maxy = d3.max(ysets);

    const yDomain = [miny, maxy];

    this.colors = ['red','blue','yellow','green','orange'];
    // create scales
    this.xScale = d3.scaleLinear().domain(xDomain).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    
    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));
     this.lines=[];
    for(var i=1;i<this.data[0].length; i++) {
      this.lines.push(d3.line()
    .x(d => this.xScale(d[0]))
    .y(d => this.yScale(d[i])));
    this.chart.append("path")
      .attr("fill", "none")
    //  .attr("class", "line")
     .attr("class", "line"+this.colors[i-1])
      .attr("stroke", this.colors[i-1])
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", this.lines[i-1](this.data));
    }

  }

  updateChart() {
    this.xScale.domain([d3.min(this.data, d => d[0]), d3.max(this.data, d => d[0])]);
    var ysets=[];
    for(var i=1;i<this.data[0].length; i++) {
      ysets.push(d3.min(this.data, d => d[i]));
    } 
    var miny = d3.min(ysets);
    ysets=[];
    for(var i=1;i<this.data[0].length; i++) {
      ysets.push(d3.max(this.data, d => d[i]));
    } 
    var maxy = d3.max(ysets);

    this.yScale.domain([miny, maxy]);
  //  this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    
    
    for(var i=1;i<this.data[0].length; i++) {
       this.chart.select(".line"+this.colors[i-1])   // change the line
            .transition(750)
      .attr("d", this.lines[i-1](this.data));
    }
}

}
