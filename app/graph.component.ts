import { Component, ElementRef, OnInit, OnChanges,
         AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import swal from 'sweetalert2';
import robotDimension  from './graph/robot-dimension';
import mazeMap from "./graph/maze/mazes";
import mazeEnd from "./graph/maze/mazeEnd";
import * as d3 from 'd3';

@Component({
  selector: 'd3-graph',
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

      :host /deep/ .sensor {
        fill: #ddd;
        opacity: .15;
      }

    `]
})
export class GraphComponent implements OnInit, OnChanges, AfterViewInit {

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
  private direction; // 1 = North, 2 = East, 3 = South, 4 = West
  private linesName;
  private mazeGoalName;
  public front_sensor_reading, front_sensor, front_threshold;
  public side_sensor_reading, side_sensor, side_threshold;
  private crash
  private svg;

  constructor(element: ElementRef) {
    this.el = element;
  }

  ngOnInit() {
    this.setup();
    this.draw();
    this.drawMaze(mazeMap.mazes.emptyMaze);
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
    this.side_threshold = 36;
    this.front_threshold = 26;
    this.side_sensor_reading = 100;
    this.front_sensor_reading = 25;
    this.crash = 0;
  }

  public draw(): void {
    this.svg = d3.select(this.el.nativeElement).select("div")
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

    this.svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + this.height + ")")
      .call(xAxis);

    this.svg.append("g")
      .attr("class", "grid")
      .call(yAxis);

    this.robot = this.svg.append("g")
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

    var sensors = this.svg.append("g")
      .attr("class", "sensors");

    var front_sensorText = sensors.append("text")
      .text("Front Sensor: ")
      .attr("text-anchor", "right")
      .attr("font-size", "12px")
      .style("fill", "black")
      .attr("transform", "translate(15,15)");

    this.front_sensor = sensors.append("text")
      .text("-")
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

    this.side_sensor = sensors.append("text")
      .text("-")
      .attr("text-anchor", "right")
      .attr("font-size", "12px")
      .style("fill", "black")
      .attr("transform", "translate(90,30)");

    this.robot.attr("transform", "translate(" + (0 + this.xGap) + "," + ((this.scale * 3) + this.yGap) + ")")

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
    }

    function sideSensorRange() {
      return `
        M 80, 20
        l 50,-15
        l 0,45
        l -50,-15
        z
      `;
    }

  private map_maze(maze): void {
    var totalLines = maze.length;
    this.linesName = new Array(totalLines);
    for (var i = 0; i < totalLines; i++) {
      this.linesName[i] = maze[i].name;
    }
  }

  public drawMaze(maze, mazeGoal, mazeGoalName): void {
    var endmazes = this.svg.append("g")
      .attr("class", "end-maze")
      .attr("z-index", 1)
      .append("path")
      .attr("d", mazeGoal)
      .style("fill", "#AFFFBA");

    var mazes = this.svg.append("g")
      .attr("class", "maze")
      .selectAll("line")
      .data(maze)
      .enter()
      .append("line");

    var mazeInput = mazes
      .attr("x1", function(d) { return d.x1; })
      .attr("y1", function(d) { return d.y1; })
      .attr("x2", function(d) { return d.x2; })
      .attr("y2", function(d) { return d.y2; })
      .attr("stroke-width", 9)
      .attr("stroke", "black");

    this.mazeGoalName = mazeGoalName;
    this.map_maze(maze);
  }

  private updateRobot(value: number): void {
    if (this.angle == 360 || this.angle == -360) {
      this.angle = 0;
    }


    var front, side;
    var currentAngle = this.angle;
    //Turn right
    if (value > 0) {
      this.angle += 90;
      if (currentAngle == 0) {
        this.direction = 2;
        front = -90;
        side = -10;
      } else if (currentAngle == 90 || currentAngle == -270) {
        this.direction = 3;
        front = -100;
        side = -80;
      } else if (currentAngle == 180 || currentAngle == -180) {
        this.direction = 4;
        front = 10;
        side = -90;
      } else if (currentAngle == 270 || currentAngle == -90) {
        this.direction = 1;
        front = 0;
        side = 0;
      }

    } else { // Turn Left
      this.angle -= 90;
      if (currentAngle == 0) {
        this.direction = 4;
        front = 10;
        side = -90;
      } else if (currentAngle == 90 || currentAngle == -270) {
        this.direction = 1;
        front = 0;
        side = 0;
      } else if (currentAngle == 180 || currentAngle == -180) {
        this.direction = 2;
        front = -90;
        side = -10;
      } else if (currentAngle == 270 || currentAngle == -90) {
        this.direction = 3;
        front = -100;
        side = -80;
      }
    }

    front += this.check_obstacle(1);
    side += this.check_obstacle(2);
    if (this.direction == 1) {
      front = this.yCoord - front;
      side = side - (this.xCoord + 80);
    } else if (this.angle == 90 || this.angle == -270) {
      front = front - this.xCoord;
      side = side - (this.yCoord + 80);
    } else if (this.angle == 180 || this.angle == -180) {
      front = front - this.yCoord;
      side = (this.xCoord - 80) - side;
    } else if (this.angle == 270 || this.angle == -90) {
      front = this.xCoord - front;
      side = (this.yCoord - 80) - side;
    }

    var front_sensor_reading = this.front_sensor_reading;
    var format = d3.format(",d");
    this.front_sensor
      .transition()
      .duration(1000)
      .tween("text", function() {
        var that = d3.select(this),
          i = d3.interpolateNumber(front_sensor_reading, front);
        return function(t) { that.text(format(i(t))); };
      });

    var side_sensor_reading = this.side_sensor_reading;
    this.side_sensor
      .transition()
      .duration(1000)
      .tween("text", function() {
        var that = d3.select(this),
          i = d3.interpolateNumber(side_sensor_reading, side);
        return function(t) { that.text(format(i(t))); };
      });

    this.update_frontSensor(front, side);
  }

  public turnRight(): void {
    this.checkPosition();
    var rotate = this.angle;
    var x = this.xCoord;
    var y = this.yCoord;

    this.check_frontSensor();
    this.updateRobot(90);

    var rectTransition = this.robot.transition()
      .duration(1000)
      .attrTween("transform", tween);

    function tween() {
      var i = d3.interpolate(rotate, rotate += 90);
      return function(t) {
        return "translate(" + x + "," + y + ") rotate(" + i(t) + "," + 40 + "," + 50 + ")";
      }
    }

    this.prevCmd = "turnRight";
  }

  public turnLeft(): void {
    this.checkPosition();
    var rotate = this.angle;
    var x = this.xCoord;
    var y = this.yCoord;

    this.check_frontSensor();
    this.updateRobot(-90);

    var rectTransition = this.robot.transition()
      .duration(1000)
      .attrTween("transform", tween);

    function tween() {
      var i = d3.interpolate(rotate, rotate -= 90);
      return function(t) {
        return "translate(" + x + "," + y + ") rotate(" + i(t) + "," + 40 + "," + 50 + ")";
      }
    }
    this.prevCmd = "turnLeft";
  }

  public reset(): void {
    this.angle = 0;
    this.direction = 1;
    this.xCoord = 0 + this.xGap;
    this.yCoord = (this.scale * 3) + this.yGap;
    this.crash = 0;
    this.robot.attr("transform", "translate(" + this.xCoord + "," + this.yCoord + ")");
    this.turnLeft();
    this.turnRight();
  }

  public stopRobot(): void {
    this.crash = 1;
  }

  // If row is below 1 or above 4, stop animation as the robot has crashed into the wall
  // If column is below 1 or above 6, stop animation as well
  // If either condition is true, limit the robot movement to hit the wall only
  // Row < 1 -> (yCoord - 25)
  // Row > 4 -> (yCoord + 25)
  // Col < 1 -> (xCoord - 25)
  // Col > 6 -> (xCoord + 25)
  private move(duration: number, front: number, side: number): void {
    //Default 1s if none is provided
    if (duration == null) { duration = 1000; console.log("Why am i here"); }
    this.robot.transition()
      .attr("transform", "translate(" + this.xCoord + "," + this.yCoord + ") rotate(" + this.angle + ")")
      .duration(duration);

    var front_sensor_reading = this.front_sensor_reading;
    var format = d3.format(",d");
    this.front_sensor
      .transition()
      .duration(duration)
      .tween("text", function() {
        var that = d3.select(this),
          i = d3.interpolateNumber(front_sensor_reading, front);
        return function(t) { that.text(format(i(t))); };
      });

    var side_sensor_reading = this.side_sensor_reading;
    this.side_sensor
      .transition()
      .duration(duration)
      .tween("text", function() {
        var that = d3.select(this),
          i = d3.interpolateNumber(side_sensor_reading, side);
        return function(t) { that.text(format(i(t))); };
      });

    var row = this.check_maze_row(this.yCoord);
    var col = this.check_maze_col(this.xCoord);
    this.check_maze_complete(row, col);
  }

  public moveBackward(value: number, duration: number): void {

    this.check_frontSensor();
    if (this.angle == 0) {
      this.yCoord += value;
      if (this.yCoord > (this.scale * 4 - robotDimension.base.height)) {
        this.yCoord = (this.scale * 4 - robotDimension.base.height);
      }
    } else if (this.angle == 90 || this.angle == -270) {
      this.xCoord -= value;
      if (this.xCoord < robotDimension.base.height) {
        this.xCoord = robotDimension.base.height;
      };
    } else if (this.angle == 180 || this.angle == -180) {
      this.yCoord -= value;
      if (this.yCoord < robotDimension.base.height) {
        this.yCoord = robotDimension.base.height;
      }
    } else if (this.angle == 270 || this.angle == -90) {
      this.xCoord += value;
      if (this.xCoord > (this.scale * 6 - robotDimension.base.height)) {
        this.xCoord = (this.scale * 6 - robotDimension.base.height);
      }
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
    var front = this.check_obstacle(1);
    var side = this.check_obstacle(2);

    if (this.direction == 1) {
      front = this.yCoord - front;
      side = side - (this.xCoord + 80);
    } else if (this.angle == 90 || this.angle == -270) {
      front = front - this.xCoord;
      side = side - (this.yCoord + 80);
    } else if (this.angle == 180 || this.angle == -180) {
      front = front - this.yCoord;
      side = (this.xCoord - 80) - side;
    } else if (this.angle == 270 || this.angle == -90) {
      front = this.xCoord - front;
      side = (this.yCoord - 80) - side;
    }
    this.move(duration, front, side);
    this.prevCmd = "moveBackward";
  }

  public moveForward(value: number, duration: number): void {
    var crash = 0;

    if (this.prevCmd == "turnRight" || this.prevCmd == "turnLeft") {
      if (value >= this.front_sensor_reading) {
        value = this.front_sensor_reading;
        crash = 1;
      }
    }

    if (this.front_sensor_reading != 0) { this.check_frontSensor(); }

    if (this.prevCmd != "turnRight" || this.prevCmd != "turnLeft") {
      if (value >= this.front_sensor_reading) {
        if (this.front_sensor_reading == value) {
          value = 0;
          crash = 1;
        } else {
          value = this.front_sensor_reading;
          crash = 1;
        }
      }

    }

    if (this.direction == 1) {
      this.yCoord -= value;
    } else if (this.angle == 90 || this.angle == -270) {
      this.xCoord += value;
    } else if (this.angle == 180 || this.angle == -180) {
      this.yCoord += value;
    } else if (this.angle == 270 || this.angle == -90) {
      this.xCoord -= value
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

    var front = this.check_obstacle(1);
    var side = this.check_obstacle(2);
    if (this.direction == 1) {
      front = this.yCoord - front;
      side = side - (this.xCoord + 80);
    } else if (this.angle == 90 || this.angle == -270) {
      front = front - this.xCoord;
      side = side - (this.yCoord + 80);
    } else if (this.angle == 180 || this.angle == -180) {
      front = front - this.yCoord;
      side = (this.xCoord - 80) - side;
    } else if (this.angle == 270 || this.angle == -90) {
      front = this.xCoord - front;
      side = (this.yCoord - 80) - side;
    }

    if (crash) {
      front = 0;
      this.crash = crash;
    }

    this.move(duration, front, side);
    this.update_frontSensor(front, side);
    if (crash) {
      swal({
        title: 'Oh no :(',
        text: 'You have crashed the robot..Resetting robot in 3 seconds',
        type: 'error',
        timer: 3000,
        confirmButtonText:
        'Reset robot'
      });
      var parent = this;
      setTimeout(function() { parent.reset(); }, 3000);
    }

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

  public check_frontSensor(): void {
    if (this.direction == 1) {
      this.front_sensor_reading = this.yCoord - this.check_obstacle(1);
    } else if (this.direction == 2) {
      this.front_sensor_reading = this.check_obstacle(1) - this.xCoord;
      this.side_sensor_reading = this.check_obstacle(2) - (this.yCoord + robotDimension.base.width);
    } else if (this.direction == 3) {
      this.front_sensor_reading = this.check_obstacle(1) - this.yCoord;
      this.side_sensor_reading = (this.xCoord - robotDimension.base.width) - this.check_obstacle(2);
    } else if (this.direction == 4) {
      this.front_sensor_reading = this.xCoord - this.check_obstacle(1);
      this.side_sensor_reading = (this.yCoord - robotDimension.base.width) - this.check_obstacle(2);
    }
  }

  private update_frontSensor(front: number, side: number): void {
    this.front_sensor_reading = front;
    this.side_sensor_reading = side;
  }

  private check_maze_complete(row: number, col: number): boolean {
    if (this.mazeGoalName != undefined) {
      if (this.mazeGoalName.includes("R" + row + "C" + col)) {
        setTimeout(function() {
          swal({
            title: 'Good Job!',
            text: 'You have completed the maze!',
            type: 'success',
            timer: 2500
          });
        }, 1500);
      }
    }
  }

  private check_maze_col(x): void {
    var col;
    if (x >= 0 && x <= (this.scale)) { col = 1; }
    else if (x > (this.scale) && x <= (this.scale * 2)) { col = 2; }
    else if (x > (this.scale * 2) && x <= (this.scale * 3)) { col = 3; }
    else if (x > (this.scale * 3) && x <= (this.scale * 4)) { col = 4; }
    else if (x > (this.scale * 4) && x <= (this.scale * 5)) { col = 5; }
    else if (x > (this.scale * 5) && x <= (this.scale * 6)) { col = 6; }

    return col;
  }

  private check_maze_row(y): void {
    var row;
    if (y >= 0 && y <= (this.scale)) { row = 1; }
    else if (y >= (this.scale) && y < (this.scale * 2)) { row = 2; }
    else if (y >= (this.scale * 2) && y < (this.scale * 3)) { row = 3; }
    else if (y >= (this.scale * 3) && y < (this.scale * 4)) { row = 4; }

    return row;
  }
  private check_obstacle(sensor: number): number { // Front sensor = 1, Side Sensor = 2
    var x = this.xCoord;
    var y = this.yCoord;
    var row = this.check_maze_row(y);
    var col = this.check_maze_col(x);

    if ((this.direction == 1 && sensor == 1) || (this.direction == 4 && sensor == 2)) {
      var current_line = "R" + (row - 1) + "C" + col;
      var second_line = ("R" + (row - 2) + "C" + col);
      var third_line = ("R" + (row - 3) + "C" + col);
      if (row == 1) { return 0; }
      else if (row == 2) {
        if ((this.linesName.indexOf(current_line)) > -1) { return (this.scale); }
        else { return 0; }
      }
      else if (row == 3) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale); }
        else { return 0; }
      }
      else if (row == 4) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 3); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(third_line) > - 1) { return (this.scale * 1); }
        else { return 0; }
      }
    }

    if ((this.direction == 3 && sensor == 1) || (this.direction == 2 && sensor == 2)) {
      var current_line = "R" + (row) + "C" + col;
      var second_line = "R" + (row + 1) + "C" + col;
      var third_line = "R" + (row + 2) + "C" + col;
      if (row == 4) { return (this.scale * 4); }
      if (row == 3) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 3); }
        else { return (this.scale * 4); }
      }
      if (row == 2) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 3); }
        else { return (this.scale * 4); }
          else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 4); }
      }
      if (row == 1) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(third_line) > - 1) { return (this.scale * 3); }
        else { return (this.scale * 4); }
      }
    }

    if ((this.direction == 2 && sensor == 1) || (this.direction == 1 && sensor == 2)) {
      var current_line = "C" + (col) + "R" + row;
      var second_line = "C" + (col + 1) + "R" + row;
      var third_line = "C" + (col + 2) + "R" + row;
      var fourth_line = "C" + (col + 3) + "R" + row;
      var fifth_line = "C" + (col + 4) + "R" + row;
      var last_line = "C" + (col + 5) + "R" + row;
      if (col == 6) { return (this.scale * 6); }
      if (col == 5) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 5); }
        else { return (this.scale * 6); }
      }
      if (col == 4) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 4); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 5); }
        else { return (this.scale * 6); }
      }
      if (col == 3) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 3); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 4); }
        else if (this.linesName.indexOf(third_line) > - 1) { return (this.scale * 5); }
        else { return (this.scale * 6); }
      }
      if (col == 2) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 3); }
        else if (this.linesName.indexOf(third_line) > - 1) { return (this.scale * 4); }
        else if (this.linesName.indexOf(fourth_line) > - 1) { return (this.scale * 5); }
        else { return (this.scale * 6); }
      }
      if (col == 1) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(third_line) > - 1) { return (this.scale * 3); }
        else if (this.linesName.indexOf(fourth_line) > - 1) { return (this.scale * 4); }
        else if (this.linesName.indexOf(fifth_line) > - 1) { return (this.scale * 5); }
        else { return (this.scale * 6); }
      }
    }

    if ((this.direction == 4 && sensor == 1) || (this.direction == 3 && sensor == 2)) {
      var current_line = "C" + (col - 1) + "R" + row;
      var second_line = "C" + (col - 2) + "R" + row;
      var third_line = "C" + (col - 3) + "R" + row;
      var fourth_line = "C" + (col - 4) + "R" + row;
      var fifth_line = "C" + (col - 5) + "R" + row;

      if (col == 1) { return 0; }
      if (col == 2) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale); }
        else { return 0; }
      }
      if (col == 3) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale); }
        else { return 0; }
      }
      if (col == 4) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 3); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(third_line) > - 1) { return (this.scale * 1); }
        else { return 0; }
      }
      if (col == 5) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 4); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 3); }
        else if (this.linesName.indexOf(third_line) > - 1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(fourth_line) > - 1) { return (this.scale * 1); }
        else { return 0; }
      }
      if (col == 6) {
        if (this.linesName.indexOf(current_line) > -1) { return (this.scale * 5); }
        else if (this.linesName.indexOf(second_line) > - 1) { return (this.scale * 4); }
        else if (this.linesName.indexOf(third_line) > - 1) { return (this.scale * 3); }
        else if (this.linesName.indexOf(fourth_line) > - 1) { return (this.scale * 2); }
        else if (this.linesName.indexOf(fifth_line) > - 1) { return (this.scale * 1); }
        else { return 0; }
      }
    }
  }

  public receiveCmd(cmdStack: string[], timeStack: number[]): void {
    var parent = this;
    function recursion(cmdStack, timeStack, i): void {
      eval(cmdStack[i]);
      i += 1;
      if (i >= cmdStack.length || parent.crash == 1) { return; };

      setTimeout(function() { recursion(cmdStack, timeStack, i); }, timeStack[i - 1]);
    }

    recursion(cmdStack, timeStack, 0);
  }

  public for_loop_cmd_found(cmdStack: string[], timeStack: number[]): void {
    var parent = this;
    console.log("CmdStack size=" + cmdStack.length);
    var initial_num;
    var condition_num;
    for (var i = 0; i < cmdStack.length; i++) {
      console.log("command[" + i + "]: " + cmdStack[i]);
      if (cmdStack[i].match(/for-loop-start/g) != null) {
        var value = cmdStack[i].substr((cmdStack[i].indexOf("(") + 1));
        initial_num = value.slice(0, value.indexOf(","));
        condition_num = value.slice(value.indexOf(",") + 1, value.indexOf(")"));
        console.log("For loop-> initial_num:" + initial_num + " | condition:" + condition_num);
        cmdStack.splice(i, 1);
      }
    }

    for (var i = 0; i < cmdStack.length; i++) {
      console.log("new command[" + i + "]: " + cmdStack[i] + " | time:" + timeStack[i]);
    }
    function recursion(cmdStack, timeStack, i, j): void {
      eval(cmdStack[j]);
      i += 1;
      j += 1;
      if (i >= (parseInt(condition_num) * (cmdStack.length + 1)) || parent.crash == 1) { return; };
      if ((i % (cmdStack.length + 1)) == 0) { j = 0; }
      setTimeout(function() { recursion(cmdStack, timeStack, i, j); }, timeStack[j - 1]);
    }

    recursion(cmdStack, timeStack, parseInt(initial_num), 0);
  }

  public while_loop_cmd_found(cmdStack: string[], timeStack: number[]): void {
    var parent = this;
    for (var i = 0; i < cmdStack.length; i++) {
      if (cmdStack[i].match(/while-loop-start/g) != null) {
        var value = cmdStack[i].substr((cmdStack[i].indexOf("(") + 1));
        cmdStack.splice(i, 1);
      }

    }

    function recursion(cmdStack, timeStack, i, j): void {
      eval(cmdStack[j]);
      i += 1;
      j += 1;
      if (i >= (1000 * (cmdStack.length + 1)) || parent.crash == 1) { return;  };
      if ((i % (cmdStack.length + 1)) == 0) { j = 0; }
      setTimeout(function() { recursion(cmdStack, timeStack, i, j); }, timeStack[j - 1]);
    }

    recursion(cmdStack, timeStack, 0, 0);
  }

  public scenario2D(distance: number): void {
    this.moveForward(distance, distance * 30);
  }

  public scenario3B(front_threshold_value: number): void {
    this.front_threshold = front_threshold_value;
    var distance = this.front_sensor_reading - this.front_threshold;
    this.moveForward(distance, distance * 30);
  }

  public scenario3C(front_threshold_value: number): void {
    var parent = this;
    parent.front_threshold = front_threshold_value;
    function scenario3Ci(): void {
      if (parent.front_sensor_reading > parent.front_threshold) {
        setTimeout(() => { parent.moveForward(5, 33); }, 33);
      } else {
        setTimeout(() => { parent.moveBackward(5, 33); }, 33);
      }
    }

    function recursion(num, i): void {
      scenario3Ci();
      i += 1;
      if (i >= num || parent.crash == 1) { return; }

      setTimeout(function() { recursion(num, i); }, 200);
    }

    recursion(200, 0);
  }

  public scenario3D(front_threshold_value: number): void {
    var parent = this;
    parent.front_threshold = front_threshold_value;
    function scenario3Di(): void {
      if (parent.front_sensor_reading < parent.front_threshold) {
        setTimeout(() => { parent.turnRight(); }, 1000);
      } else {
        setTimeout(() => { parent.moveForward(150, 1000); }, 1000);
      }
    }

    function recursion(num, i): void {
      scenario3Di();
      i += 1;
      if (i >= num || parent.crash == 1) { return; }

      setTimeout(function() { recursion(num, i); }, 1000);
    }

    recursion(300, 0);
  }

  public finalScenario(): void {
    var parent = this;
    function rightWallFollower(): void {
      if (parent.side_sensor_reading > parent.side_threshold) {
        setTimeout(() => { parent.turnRight(); }, 0);
        setTimeout(() => { parent.moveForward(150, 1000); }, 1000);

      } else if (parent.side_sensor_reading < parent.side_threshold &&
        parent.front_sensor_reading > parent.front_threshold) {
        setTimeout(() => { parent.moveForward(150, 1000); }, 1000);
      } else if (parent.side_sensor_reading < parent.side_threshold &&
        parent.front_sensor_reading < parent.front_threshold) {
        setTimeout(() => { parent.turnLeft(); }, 1000);
      }
    }

    function recursion(num, i): void {
      rightWallFollower();
      i += 1;
      if (i >= num || parent.crash == 1) { return; };

      setTimeout(function() { recursion(num, i); }, 1750);
    }

    recursion(200, 0);
  }

}
