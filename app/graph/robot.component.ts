import { Injectable, ElementRef, OnInit, OnChanges, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  selector: 'd3-graph',
  // encapsulation: ViewEncapsulation.None,
  template: `
    <div></div>
    `,
    styles: [`

      :host /deep/ .grid .tick line {
        stroke: lightgrey;
        opacity: 0.7;
        shape-rendering: crispEdges;
      }

      //This is the border of the graph
      :host /deep/ .grid path {
        stroke-width: 1;
        stroke: black;
      }

      :host /deep/ .robot {
          fill : 	#DEB887;
      }

    `]
  // stylesUrls: ['graph.component.css']
})
export class TestGraphComponent implements OnInit, OnChanges, AfterViewInit {

  private el: any;
  private host;
  private height;
  private width;
  private margin;
  private xTick;
  private yTick;
  private robot;

  constructor(element: ElementRef) {
    this.el = element;
  }

  ngOnInit() {
    this.setup();
    this.draw();
  }

  ngAfterViewInit() {
    console.log("Is this executed?");

  }

  ngOnChange() {
    this.move();
  }

  private setup(): void {
    var w = 940;
    var h = 540;
    this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    this.width = w - this.margin.left - this.margin.right;
    this.height = h - this.margin.top - this.margin.bottom;
    this.xTick = this.width / 80;
    this.yTick = this.height / 80;
  }

  private draw(): void {
    var svg = d3.select(this.el.nativeElement).select("div")
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    var x = d3.scaleLinear()
      .range([0, this.width])
      .domain([0, this.width]);

    var y = d3.scaleLinear()
      .range([this.height, 0])
      .domain([0, this.height]);

    var xAxis = d3.axisBottom()
      .scale(x)
      .ticks(this.xTick)
      .tickSize(-this.height)
      .tickFormat("");

    var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(this.yTick)
      .tickSize(-this.width)
      .tickFormat(""));

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "grid")
      .call(yAxis);

    this.robot = svg.append("g");

    this.robot.append("rect")
      .attr("x", this.width/2 )
      .attr("y", this.height -100)
      .attr("width", 80)
      .attr("height", 100)
      .attr("class", "robot");
  }

  export function move(): void {
    this.robot.append("rect")
      .attr("x", this.width/2 )
      .attr("y", this.height -300)
      .attr("width", 80)
      .attr("height", 100)
      .attr("class", "robot");
  }
}
