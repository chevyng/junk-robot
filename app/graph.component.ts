import { Component, ElementRef, OnInit, OnChanges, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'd3-graph',
  // encapsulation: ViewEncapsulation.None,
  template: `
    <div></div>
    <button type="button" class="btn btn-default" (click)="animateLeft();"> Turn left </button>
    <button type="button" class="btn btn-default" (click)="animateRight();"> Turn right </button>
    <button type="button" class="btn btn-default" (click)="moveForward();"> Move Forward </button>
    <button type="button" class="btn btn-default" (click)="moveBackward();"> Move Backward </button>
    <button type="button" class="btn btn-default" (click)="reset();"> Reset </button>

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
  private xCoord;
  private yCoord;
  private angle = 0;

  private dimension = {
    w: 80,
    h: 100
  };


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
    // this.move();
  }

  private setup(): void {
    var w = 940;
    var h = 540;
    this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    this.width = w - this.margin.left - this.margin.right;
    this.height = h - this.margin.top - this.margin.bottom;
    this.xTick = this.width / 80;
    this.yTick = this.height / 80;
    this.xCoord = this.width/2;
    this.yCoord = this.height/2;
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

    this.robot = svg.append("g")
      .attr("class", "robot");

    this.robot.append("rect")
      // .attr("x", this.xCoord)
      // .attr("y", this.yCoord)
      .attr("width", this.dimension.w)
      .attr("height", this.dimension.h)
      .attr("class", "robot");


    var circleData = [
      { "cx": (this.dimension.w / 3.5), "cy":  this.dimension.h / 4, "radius": 8 },
      { "cx": (this.dimension.w - this.dimension.w / 3.5), "cy":  this.dimension.h / 4, "radius": 8 }
    ];

    var circles = this.robot.selectAll("circle")
      .data(circleData)
      .enter()
      .append("circle");

    var circlesAttributes = circles
      .attr("cx", function(d) { return d.cx; })
      .attr("cy", function(d) { return d.cy; })
      .attr("r", function(d) { return d.radius; })
      .style("fill", "black");

    this.robot.attr("transform", "translate(" + (this.width/2) + "," + (this.height/2) + ")")
    console.log("current (x,y) : (" + this.xCoord + "," + this.yCoord + ")");
  }

  private updateRobot(): void {

    this.robot.enter()
      .append("rect")
      .attr("x", this.xCoord)
      .attr("y", this.yCoord)
      .attr("width", this.dimension.w)
      .attr("height", this.dimension.h);

    console.log("current (x,y) : (" + this.xCoord + "," + this.yCoord + ")");
  }

  // animateRight(): void {
  //   console.log("animate function");
  //   var rectTransition = this.robot.transition()
  //                         .duration(3000)
  //                         .attrTween("transform", tween);
  //
  //   var rotate = this.angle;
  //   var x = this.xCoord;
  //   var y = this.yCoord;
  //   function tween() {
  //     var i = d3.interpolate(rotate, rotate += 90);
  //     return function(t) {
  //       return "rotate(" + i(t) + "," + x + "," + y + ")";
  //     }
  //   }
  //   this.angle += 90;
  //   this.updateRobot();
  // }

  animateRight(): void {
    console.log("animate function");
    // this.angle += 90;
    var rotate = this.angle;
    var x = this.xCoord ;
    var y = this.yCoord ;

    // var rectTransition = this.robot.transition()
    //                       .duration(2000)
    //                       .attr("transform", "translate(" + x + "," + y + ")" + "rotate(" + rotate + ",40,50" +")");

    var rectTransition = this.robot.transition()
                          .duration(2000)
                          .attrTween("transform", tween );

    function tween() {
      var i = d3.interpolate(rotate, rotate += 90);
      return function(t) {
        return "translate(" + x + "," + y + ") rotate(" + i(t) + "," + 40 + "," + 50 + ")";
      }
    }
    this.angle += 90;
    this.updateRobot();
  }

  animateLeft(): void {
    console.log("animate function");
    // this.angle -= 90;
    var rotate = this.angle;
    var x = this.xCoord ;
    var y = this.yCoord ;
    var rectTransition = this.robot.transition()
                          .duration(2000)
                          .attrTween("transform", tween );

    function tween() {
      var i = d3.interpolate(rotate, rotate -= 90);
      return function(t) {
        return "translate(" + x + "," + y + ") rotate(" + i(t) + "," + 40 + "," + 50 + ")";
      }
    }
    this.angle -= 90;
    this.updateRobot();
  }

  reset(): void {
    console.log("reset function");
    this.angle = 0;
    //   this.robot.select("rect")
    //     .transition()
    //     .attr("transform", "translate(0)")
    //     .attr("x", this.width / 2)
    //     .attr("y", this.height - 100);
    // }

    this.robot.select("rect")
      .transition()
      .duration(4000)
      .attrTween("transform", tween);

    function tween() {
      var i = d3.interpolate(90, 0);
      return function(t) {
        return "rotate(" + i(t) + ",520,490)";
      }
    }
  }

  moveForward(): void {
    // this.robot.transition()
    //   .attr("transform", "translate(0,-200)")
    //   .duration(2000);
    this.yCoord += 100;
    this.updateRobot();

      this.robot.transition()
        .attr("transform","translate(" + this.xCoord + "," + this.yCoord + ") rotate(" + this.angle + ")")
        .duration(500);
  }

  moveBackward(yValue: number): void {
    this.yCoord -= 100;
    this.updateRobot();

    this.robot.transition()
      .attr("transform", "translate(" + this.xCoord + "," + this.yCoord + ") rotate(" + this.angle + ")")
      .duration(500);


  }
