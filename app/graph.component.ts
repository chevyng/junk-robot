import { Component, ElementRef, OnInit, OnChanges, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as d3 from 'd3';

@Component({
  selector: 'd3-graph',
  // encapsulation: ViewEncapsulation.None,
  template: `
    <div></div>
    <button type="button" class="btn btn-default" (click)="turnLeft();"> Turn left </button>
    <button type="button" class="btn btn-default" (click)="turnRight();"> Turn right </button>
    <button type="button" class="btn btn-default" (click)="moveForward();"> Move Forward </button>
    <button type="button" class="btn btn-default" (click)="moveBackward();"> Move Backward </button>
    <button type="button" class="btn btn-default" (click)="test();"> Test Circuit </button>
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
  private prevCmd: string;
  private direction; // 1 = North, 2 = East, 3 = South, 4 = West

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
  }

  private setup(): void {
    var w = 940;
    var h = 540;
    this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    this.width = w - this.margin.left - this.margin.right;
    this.height = h - this.margin.top - this.margin.bottom;
    this.xTick = this.width / 80;
    this.yTick = this.height / 80;
    this.xCoord = this.width / 2;
    this.yCoord = this.height / 2;
    this.direction = 1;
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
      .attr("width", this.dimension.w)
      .attr("height", this.dimension.h)
      .attr("class", "robot");


    var circleData = [
      { "cx": (this.dimension.w / 3.5), "cy": this.dimension.h / 4, "radius": 8 },
      { "cx": (this.dimension.w - this.dimension.w / 3.5), "cy": this.dimension.h / 4, "radius": 8 }
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

    this.robot.attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")")
    console.log("current (x,y) : (" + this.xCoord + "," + this.yCoord + ")");
  }

  private updateRobot(value: number): void {
    if (this.angle == 360 || this.angle == -360) {
      this.angle = 0;
    }

    var currentAngle = this.angle;
    //Turn right
    if (value > 0) {
      this.angle += 90;
      if (currentAngle == 0) {
        this.direction = 2;
      } else if (currentAngle == 90 || currentAngle == -270) {
        this.direction = 3;
      } else if (currentAngle == 180 || currentAngle == -180) {
        this.direction = 4;
      } else if (currentAngle == 270 || currentAngle == -90) {
        this.direction = 1;
      }
      // if (currentAngle == 0) {
      //   this.xCoord += 90;
      //   this.yCoord += 10;
      // } else if (currentAngle == 90 || currentAngle == -270) {
      //   this.xCoord -= 10;
      //   this.yCoord += 90;
      // } else if (currentAngle == 180 || currentAngle == -180) {
      //   this.xCoord -= 90;
      //   this.yCoord -= 10;
      // } else if (currentAngle == 270 || currentAngle == -90) {
      //   this.xCoord += 10;
      //   this.yCoord -= 90;
      // }
    } else { // Turn Left
      this.angle -= 90;
      if (currentAngle == 0) {
        this.direction = 4;
      } else if (currentAngle == 90 || currentAngle == -270) {
        this.direction = 1;
      } else if (currentAngle == 180 || currentAngle == -180) {
        this.direction = 2;
      } else if (currentAngle == 270 || currentAngle == -90) {
        this.direction = 3;
      }
      //Only add if next command is moveForward/Backward
      //Don't add if next command is turn if not the coordinates will be wrong
      // if (currentAngle == 0) {
      //   this.xCoord -= 90;
      //   this.yCoord -= 10;
      // } else if (currentAngle == 90 || currentAngle == -270) {
      //   this.xCoord += 10;
      //   this.yCoord -= 90;
      // } else if (currentAngle == 180 || currentAngle == -180) {
      //   this.xCoord += 90;
      //   this.yCoord += 10;
      // } else if (currentAngle == 270 || currentAngle == -90) {
      //   this.xCoord -= 10;
      //   this.yCoord += 90;
      // }
    }

    // if (this.angle == 0) {
    //   //No changes to (x,y)
    // } else if (this.angle == 90 || this.angle == -270) {
    //   this.xCoord += 100;
    //   //No changes to yCoord
    // } else if (this.angle == 180 || this.angle == -180) {
    //   this.xCoord += 100;
    //   this.yCoord += 100;
    // } else if (this.angle == 270 || this.angle == -90) {
    //   this.yCoord += 100;
    // }
    console.log("current (x,y) : (" + this.xCoord + "," + this.yCoord + ")");
    console.log("robot center (x,y) : (" + this.xCoord + "," + this.yCoord + ")");
    console.log("angle: " + this.angle);
  }

  private turnRight(): void {
    console.log("turn function");
    this.checkPosition();
    var rotate = this.angle;
    var x = this.xCoord;
    var y = this.yCoord;

    var rectTransition = this.robot.transition()
      .duration(1000)
      .attrTween("transform", tween);

    function tween() {
      var i = d3.interpolate(rotate, rotate += 90);
      return function(t) {
        return "translate(" + x + "," + y + ") rotate(" + i(t) + "," + 40 + "," + 50 + ")";
      }
    }
    this.updateRobot(90);
    this.prevCmd = "turnRight";
  }

  private turnLeft(): void {
    console.log("turn function");
    this.checkPosition();
    var rotate = this.angle;
    var x = this.xCoord;
    var y = this.yCoord;
    var rectTransition = this.robot.transition()
      .duration(1000)
      .attrTween("transform", tween);

    function tween() {
      var i = d3.interpolate(rotate, rotate -= 90);
      return function(t) {
        return "translate(" + x + "," + y + ") rotate(" + i(t) + "," + 40 + "," + 50 + ")";
      }
    }
    this.updateRobot(-90);
    this.prevCmd = "turnLeft";
  }

  reset(): void {
    console.log("reset function");
    this.angle = 0;
    this.direction = 1;
    this.robot.attr("transform", "translate(" + (this.width / 2) + "," + (this.height / 2) + ")")
    this.xCoord = this.width / 2;
    this.yCoord = this.height / 2;
  }

  private move(): void {
    this.robot.transition()
      .attr("transform", "translate(" + this.xCoord + "," + this.yCoord + ") rotate(" + this.angle + ")")
      .duration(1000);
  }

  private moveBackward(value: number): void {
    if (this.angle == 0) {
      this.yCoord += 100;
    } else if (this.angle == 90 || this.angle == -270) {
      this.xCoord -= 100;
    } else if (this.angle == 180 || this.angle == -180) {
      this.yCoord -= 100;
    } else if (this.angle == 270 || this.angle == -90) {
      this.xCoord += 100
    }

    if (this.prevCmd == "turnRight" || this.prevCmd == "turnLeft") {
      if (this.direction == 2) {
        this.xCoord += 90;
        this.yCoord += 10;
      } else if (this.direction == 3) {
        this.xCoord += 80;
        this.yCoord += 100;
      } else if (this.direction == 4) {
        this.xCoord -= 10;
        this.yCoord += 90;
      }
    }
    this.move();
    this.prevCmd = "moveBackward";
  }

  private moveForward(value: number): void {
    if (this.direction == 1) {
      this.yCoord -= 100;
    } else if (this.angle == 90 || this.angle == -270) {
      this.xCoord += 100;
    } else if (this.angle == 180 || this.angle == -180) {
      this.yCoord += 100;
    } else if (this.angle == 270 || this.angle == -90) {
      this.xCoord -= 100
    }

    if (this.prevCmd == "turnRight" || this.prevCmd == "turnLeft") {
      if (this.angle == 90 || this.angle == -270) {
        this.xCoord += 90;
        this.yCoord += 10;
      } else if (this.angle == 180 || this.angle == -180) {
        this.xCoord += 80;
        this.yCoord += 100;
      } else if (this.angle == 270 || this.angle == -90) {
        this.xCoord -= 10;
        this.yCoord += 90;
      }

    }
    console.log("current (x,y) : (" + this.xCoord + "," + this.yCoord + ")");
    console.log("robot center (x,y) : (" + this.xCoord + "," + this.yCoord + ")");
    console.log("angle: " + this.angle + " direction = " + this.direction );
    this.move();
    this.prevCmd = "moveForward";
  }

 //Problem is after moving forward or backward when facing ESW
 //The coordinates are not accurate due to the added coordinates
 //that was added when the robot was facing either E/S/W
// When facing East, extra (90,10) was added
  private checkPosition(): void {
    if( (this.prevCmd == "moveForward" || this.prevCmd == "moveBackward")
        && this.direction == 2 ){ // East
      this.xCoord -= 90;
      this.yCoord -= 10;
    } else if( (this.prevCmd == "moveForward" || this.prevCmd == "moveBackward")
        && this.direction == 3 ){ // South
      this.xCoord -= 80;
      this.yCoord -= 100;
    } else if( (this.prevCmd == "moveForward" || this.prevCmd == "moveBackward")
        && this.direction == 4 ){ // West
      this.xCoord += 10;
      this.yCoord -= 90;
    }
  }

  test(): void {
    this.moveForward();
    setTimeout(() => { this.turnRight(); }, 1000);
    setTimeout(() => { this.moveForward(); }, 2000);
    setTimeout(() => { this.turnRight(); }, 3000);
    setTimeout(() => { this.moveForward(); }, 4000);
    setTimeout(() => { this.turnRight(); }, 5000);
    setTimeout(() => { this.moveForward(); }, 6000);
  }
