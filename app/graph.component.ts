import { Component, ElementRef, OnInit, OnChanges, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import robotDimension  from './graph/robot-dimension';
import mazeMap from "./graph/maze/mazes";
import mazeEnd from "./graph/maze/mazeEnd";
import * as d3 from 'd3';

@Component({
  selector: 'd3-graph',
  // encapsulation: ViewEncapsulation.None,
  template: `
    <span>Distance from Obstacle/Wall : {{obstacleDist}}</span>
    <div></div>
    <span>Distance from Obstacle/Wall : {{obstacleDist}}</span>
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

      :host /deep/ .sensor {
        fill: #ddd;
        opacity: .15;
      }

    `]
})
export class TestGraphComponent implements OnInit, OnChanges, AfterViewInit {

  private el: any;
  private host;
  private height;
  private width;
  private scale;
  private margin;
  private xTick;
  private yTick;
  private robot;
  private xCoord;
  private yCoord;
  private xGap;
  private yGap;
  private angle = 0;
  private prevCmd: string;
  private current_row;
  private current_col;
  private direction; // 1 = North, 2 = East, 3 = South, 4 = West
  private linesName;
  private obstacleDist;
  private mazeMapArray;
  private currentDist;
  private nextDist;
  private front_sensor;

  constructor(element: ElementRef) {
    this.el = element;
  }

  moveForward(value: number, duration: number): void {
    if (this.direction == 1) {
      this.yCoord -= value;
    } else if (this.angle == 90 || this.angle == -270) {
      this.xCoord += value;
    } else if (this.angle == 180 || this.angle == -180) {
      this.yCoord += value;
    } else if (this.angle == 270 || this.angle == -90) {
      this.xCoord -= value;
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
    console.log("angle: " + this.angle + " direction = " + this.direction);
    this.move(duration);
    this.prevCmd = "moveForward";
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
    var h = 640;
    this.scale = 150;
    this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    this.width = w - this.margin.left - this.margin.right;
    this.height = h - this.margin.top - this.margin.bottom;
    this.xTick = this.width / this.scale;
    this.yTick = this.height / this.scale;
    this.xGap = (this.scale - robotDimension.base.width) / 2;
    this.yGap = (this.scale - robotDimension.base.height) / 2;
    this.xCoord = 0 + this.xGap;
    this.yCoord = (this.scale * 3) + this.yGap;
    this.direction = 1;
    this.current_row = 4;
    this.current_col = 1;

    this.mazeMapArray = new Array();
    for (var i = 0; i < 4; i++) {
      this.mazeMapArray[i] = new Array();
      for (var j = 0; j < 6; j++) {
        this.mazeMapArray[i][j] = 0;
      }
    }
  }

  private map_maze(): void {
    var totalLines = mazeMap.mazes.testMaze.length;
    this.linesName = new Array(totalLines);
    for (var i = 0; i < totalLines; i++) {
      this.linesName[i] = mazeMap.mazes.testMaze[i].name;
      // var row = this.linesName[i].substr(1,1);
      // var col = this.linesName[i].substr(3,3);
      // console.log(this.linesName[i] + " row:" + row + ",col:" + col);
      // this.mazeMapArray[row][col] = 1;
    }
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
      .tickValues([this.scale, this.scale * 2, this.scale * 3,
        this.scale * 4, this.scale * 5, this.scale * 6])
      .tickSize(-this.height)
      .tickFormat(formatLength);

    var yAxis = d3.axisLeft()
      .scale(y)
      .tickValues([this.scale * 1, this.scale * 2, this.scale * 3, this.scale * 4])
      .tickSize(-this.width)
      .tickFormat(formatLength);

    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "grid")
      .call(yAxis);

    var endmazes = svg.append("g")
      .attr("class", "end-maze")
      .append("path")
      .attr("d", mazeEnd.end.R4C6)
      .style("fill", "#AFFFBA");

    this.robot = svg.append("g")
      .attr("class", "robot");

    this.robot.append("rect")
      .attr("width", robotDimension.base.width)
      .attr("height", robotDimension.base.height)
      .attr("class", "robot");

    var frontSensor = this.robot.append("path")
      .attr("d", frontSensorRange())
      .attr("class", "sensor")
      .style("fill", "gray");

    var sideSensor = this.robot.append("path")
      .attr("d", sideSensorRange())
      .attr("class", "sensor")
      .style("fill", "gray");

    var circleData = [
      { "cx": robotDimension.lefteye.x, "cy": robotDimension.lefteye.y, "radius": robotDimension.lefteye.radius },
      { "cx": robotDimension.righteye.x, "cy": robotDimension.righteye.y, "radius": robotDimension.righteye.radius }
    ];

    var circles = this.robot.selectAll("circle")
      .data(circleData)
      .enter()
      .append("circle");

    /* Insert eyes to robot */
    var circlesAttributes = circles
      .attr("cx", function(d) { return d.cx; })
      .attr("cy", function(d) { return d.cy; })
      .attr("r", function(d) { return d.radius; })
      .style("fill", "black");

    var mazes = svg.append("g")
      .attr("class", "maze")
      .selectAll("line")
      .data(mazeMap.mazes.testMaze)
      .enter()
      .append("line");

    var mazeInput = mazes
      .attr("x1", function(d) { return d.x1; })
      .attr("y1", function(d) { return d.y1; })
      .attr("x2", function(d) { return d.x2; })
      .attr("y2", function(d) { return d.y2; })
      .attr("stroke-width", 9)
      .attr("stroke", "black");

    var sensors = svg.append("g")
      .attr("class", "sensors");

    var front_sensorText = sensors.append("text")
      .text("Front Sensor: ")
      .attr("text-anchor", "right")
      .attr("font-size", "12px")
      .style("fill", "black")
      .attr("transform", "translate(15,15)");

    this.front_sensor = sensors.append("text")
      .text("0")
      .attr("text-anchor", "right")
      .attr("font-size", "12px")
      .style("fill", "black")
      .attr("transform", "translate(90,15)");

    var side_sensorText = sensors.append("text")
      .text("Side Sensor: ")
      .attr("text-anchor", "right")
      .attr("font-size", "12px")
      .style("fill", "black")
      .attr("transform", "translate(15,30)");

    this.map_maze();
    this.robot.attr("transform", "translate(" + (0 + this.xGap) + "," + ((this.scale * 3) + this.yGap) + ")")
    console.log("current (x,y) : (" + this.xCoord + "," + this.yCoord + ")");

    function formatLength(d) {
      let ticks = x.ticks();
      return d === ticks[ticks.length - 1]
        ? d + " cm"
        : d;
    }

    function frontSensorRange() {
      return `
        M 25,0
        l -40,-60
        l 105,0
        l -40, 60
        z
      `;
    )
    }

    function sideSensorRange() {
      return `
        M 80, 20
        l 50,-15
        l 0,45
        l -50,-15
        z
      `;
    )
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
    }

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
    this.current_row = 4;
    this.current_col = 1;
    this.xCoord = 0 + this.xGap;
    this.yCoord = (this.scale * 3) + this.yGap;
    this.robot.attr("transform", "translate(" + this.xCoord + "," + this.yCoord + ")")
  }

  // If row is below 1 or above 4, stop animation as the robot has crashed into the wall
  // If column is below 1 or above 6, stop animation as well
  // If either condition is true, limit the robot movement to hit the wall only
  // Row < 1 -> (yCoord - 25)
  // Row > 4 -> (yCoord + 25)
  // Col < 1 -> (xCoord - 25)
  // Col > 6 -> (xCoord + 25)
  private checkForwardLimit(): void {
    if (this.direction == 1) {
      var current_line = "R" + (this.current_row - 1) + "C" + this.current_col;
      var second_line = ("R" + (this.current_row - 2) + "C" + this.current_col);
      var third_line = ("R" + (this.current_row - 3) + "C" + this.current_col);
      if (this.current_row == 1) { this.obstacleDist = 25; }
      else if (this.current_row == 2) {
        if ((this.linesName.indexOf(current_line)) > -1) { this.obstacleDist = 25; }
        else { this.obstacleDist = 25 + this.scale }
      }
      else if (this.current_row == 3) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else { this.obstacleDist = 25 + this.scale * 2; }
      }
      else if (this.current_row == 4) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; console.log("Row4") }
        else if (this.linesName.indexOf(third_line) > - 1) { this.obstacleDist = 25 + (this.scale * 2); }
        else { this.obstacleDist = 25 + (this.scale * 3); }
      }
      console.log("Obstacle Distance: " + this.obstacleDist);
    }

    if (this.direction == 3) {
      var current_line = "R" + (this.current_row) + "C" + this.current_col;
      var second_line = "R" + (this.current_row + 1) + "C" + this.current_col;
      var third_line = "R" + (this.current_row + 2) + "C" + this.current_col;
      if (this.current_row == 4) { this.obstacleDist = 25; }
      if (this.current_row == 3) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else { this.obstacleDist = 25 + this.scale }
      }
      if (this.current_row == 2) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else { this.obstacleDist = 25 + this.scale * 2; }
      }
      if (this.current_row == 1) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else if (this.linesName.indexOf(third_line) > - 1) { this.obstacleDist = 25 + this.scale * 2; }
        else { this.obstacleDist = 25 + this.scale * 3; }
      }
      console.log("Obstacle Distance: " + this.obstacleDist);
    }

    if (this.direction == 2) {
      var current_line = "C" + (this.current_col) + "R" + this.current_row;
      var second_line = "C" + (this.current_col + 1) + "R" + this.current_row;
      var third_line = "C" + (this.current_col + 2) + "R" + this.current_row;
      var fourth_line = "C" + (this.current_col + 3) + "R" + this.current_row;
      var fifth_line = "C" + (this.current_col + 4) + "R" + this.current_row;
      var last_line = "C" + (this.current_col + 5) + "R" + this.current_row;

      if (this.current_col == 6) { this.obstacleDist = 25; }
      if (this.current_col == 5) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else { this.obstacleDist = 25 + this.scale }
      }
      if (this.current_col == 4) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else { this.obstacleDist = 25 + this.scale * 2; }
      }
      if (this.current_col == 3) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else if (this.linesName.indexOf(third_line) > - 1) { this.obstacleDist = 25 + this.scale * 2; }
        else { this.obstacleDist = 25 + this.scale * 3; }
      }
      if (this.current_col == 2) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else if (this.linesName.indexOf(third_line) > - 1) { this.obstacleDist = 25 + this.scale * 2; }
        else if (this.linesName.indexOf(fourth_line) > - 1) { this.obstacleDist = 25 + this.scale * 3; }
        else { this.obstacleDist = 25 + this.scale * 4; }
      }
      if (this.current_col == 1) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else if (this.linesName.indexOf(third_line) > - 1) { this.obstacleDist = 25 + this.scale * 2; }
        else if (this.linesName.indexOf(fourth_line) > - 1) { this.obstacleDist = 25 + this.scale * 3; }
        else if (this.linesName.indexOf(fifth_line) > - 1) { this.obstacleDist = 25 + this.scale * 4; }
        else { this.obstacleDist = 25 + this.scale * 5; }
      }
      console.log("Obstacle Distance: " + this.obstacleDist);
    }

    if (this.direction == 4) {
      var current_line = "C" + (this.current_col - 1) + "R" + this.current_row;
      var second_line = "C" + (this.current_col - 2) + "R" + this.current_row;
      var third_line = "C" + (this.current_col - 3) + "R" + this.current_row;
      var fourth_line = "C" + (this.current_col - 4) + "R" + this.current_row;
      var fifth_line = "C" + (this.current_col - 5) + "R" + this.current_row;

      if (this.current_col == 1) { this.obstacleDist = 25; }
      if (this.current_col == 2) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else { this.obstacleDist = 25 + this.scale }
      }
      if (this.current_col == 3) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else { this.obstacleDist = 25 + this.scale * 2; }
      }
      if (this.current_col == 4) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else if (this.linesName.indexOf(third_line) > - 1) { this.obstacleDist = 25 + this.scale * 2; }
        else { this.obstacleDist = 25 + this.scale * 3; }
      }
      if (this.current_col == 5) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else if (this.linesName.indexOf(third_line) > - 1) { this.obstacleDist = 25 + this.scale * 2; }
        else if (this.linesName.indexOf(fourth_line) > - 1) { this.obstacleDist = 25 + this.scale * 3; }
        else { this.obstacleDist = 25 + this.scale * 4; }
      }
      if (this.current_col == 6) {
        if (this.linesName.indexOf(current_line) > -1) { this.obstacleDist = 25; }
        else if (this.linesName.indexOf(second_line) > - 1) { this.obstacleDist = 25 + this.scale; }
        else if (this.linesName.indexOf(third_line) > - 1) { this.obstacleDist = 25 + this.scale * 2; }
        else if (this.linesName.indexOf(fourth_line) > - 1) { this.obstacleDist = 25 + this.scale * 3; }
        else if (this.linesName.indexOf(fifth_line) > - 1) { this.obstacleDist = 25 + this.scale * 4; }
        else { this.obstacleDist = 25 + this.scale * 5; }
      }
      console.log("Obstacle Distance: " + this.obstacleDist);
    }

  }

  private move(duration: number): void {
    //Default 1s if none is provided
    if (duration == null) { duration = 1000; console.log("Why am i here"); }
    this.robot.transition()
      .attr("transform", "translate(" + this.xCoord + "," + this.yCoord + ") rotate(" + this.angle + ")")
      .duration(duration);
    // this.interpolateDist(duration);

    //  this.front_sensor.transition()
    //   .duration(1000)
    //   .tween("text", function(){
    //        var i = d3.interpolate(475,325 );
    //        return function(t) { console.log(i(t)); }
    //      }
    //   );
    console.log("this.prevDist=" + this.prevDist);
    var prevDist = this.prevDist;
    var nextDist = this.nextDist;
    var format = d3.format(",d");
    this.front_sensor
      .transition()
      .duration(duration)
      .tween("text", function() {
        var that = d3.select(this),
          i = d3.interpolateNumber(prevDist, nextDist);
        return function(t) { that.text(format(i(t))); };
      });
  }

  private moveBackward(value: number, duration: number): void {
    if (this.angle == 0) {
      this.yCoord += value;
      this.current_row += (value / this.scale);
    } else if (this.angle == 90 || this.angle == -270) {
      this.xCoord -= value;
      this.current_col -= (value / this.scale);
    } else if (this.angle == 180 || this.angle == -180) {
      this.yCoord -= value;
      this.current_row -= (value / this.scale);
    } else if (this.angle == 270 || this.angle == -90) {
      this.xCoord += value;
      this.current_col += (value / this.scale);
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
    this.move(duration);
    console.log("current (row,column): (" + this.current_row + "," + this.current_col + ")");
    this.prevCmd = "moveBackward";
  }

  public moveForward(value: number, duration: number): void {
    this.checkForwardLimit();
    this.prevDist = this.obstacleDist;
    if (this.direction == 1) {
      this.yCoord -= value;
      this.current_row -= (value / this.scale);
    } else if (this.angle == 90 || this.angle == -270) {
      this.xCoord += value;
      this.current_col += (value / this.scale);
    } else if (this.angle == 180 || this.angle == -180) {
      this.yCoord += value;
      this.current_row += (value / this.scale);
    } else if (this.angle == 270 || this.angle == -90) {
      this.xCoord -= value
      this.current_col -= (value / this.scale);
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
    console.log("angle: " + this.angle + " direction = " + this.direction);
    console.log("current (row,column): (" + this.current_row + "," + this.current_col + ")");
    this.checkForwardLimit();
    this.nextDist = this.obstacleDist;
    console.log("prevDist:" + this.prevDist + ", nextDist:" + this.nextDist);
    this.move(duration);
    this.prevCmd = "moveForward";
  }

  //Problem is after moving forward or backward when facing ESW
  //The coordinates are not accurate due to the added coordinates
  //that was added when the robot was facing either E/S/W
  // When facing East, extra (90,10) was added
  private checkPosition(): void {
    if ((this.prevCmd == "moveForward" || this.prevCmd == "moveBackward")
      && this.direction == 2) { // East
      this.xCoord -= 90;
      this.yCoord -= 10;
    } else if ((this.prevCmd == "moveForward" || this.prevCmd == "moveBackward")
      && this.direction == 3) { // South
      this.xCoord -= 80;
      this.yCoord -= 100;
    } else if ((this.prevCmd == "moveForward" || this.prevCmd == "moveBackward")
      && this.direction == 4) { // West
      this.xCoord += 10;
      this.yCoord -= 90;
    }
  }

  private interpolateDist(duration: number) {
    console.log("Interpolate Dist function");
    var numTween = function() {
      var i = d3.interpolate(this.prevDist, this.nextDist);
      return function(t) { this.obstacleDist = i(t); }
    }
    this.front_sensor.transition()
      .duration(1000)
      .attrTween("text", numTween);

  }



  test(): void {
    this.moveForward(125, 1000);
    setTimeout(() => { this.turnRight(); }, 1000);
    setTimeout(() => { this.moveForward(250, 2000); }, 2000);
    setTimeout(() => { this.turnRight(); }, 4000);
    setTimeout(() => { this.moveForward(125, 1000); }, 5000);
    setTimeout(() => { this.turnRight(); }, 6000);
    setTimeout(() => { this.moveForward(250, 2000); }, 7000);
  }
