import { Component, OnInit, ElementRef, OnChanges, AfterViewInit, ViewChild, AfterContent } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphComponent } from './graph.component';
import { HeaderComponent } from './header.component';

import dummyCodes from "./dummyCodes";
import mazeMap from "./graph/maze/mazes";
import mazeEnd from "./graph/maze/mazeEnd";

import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';

@Component({
  moduleId: module.id,
  selector: 'main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.css']
})
export class MainComponent implements OnInit, OnChanges, AfterViewInit, AfterContent {
  @ViewChild(GraphComponent) graph: GraphComponent;

  id: number;
  private loadCount = 0;
  private sub: any;
  private totalTime = 0;
  private stack: string[] = new Array();
  private timeStack: number[] = new Array();

  constructor(private route: ActivatedRoute, private router: Router) {
    route.params.subscribe(param => {
      this.id = param['id'];
      if (this.loadCount != 0) {
        this.router.navigateByUrl('').then(
          () => {
            this.router.navigateByUrl('maze/'+this.id);
          }
        );
      }
      this.loadCount++;
    });
  }
  config = {
    lineNumbers: true,
    mode: {
      name: 'javascript',
      json: true
    },
    theme: 'abcdef'
  };
  code = dummyCodes.sampleCode;
  submitted = false;
  onSubmit() { this.submitted = true; }
  resetForm() {
    this.code = `reset!`;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log("ID = " + this.id);
      // In a real app: dispatch action to load the details here.
    });
  }

  ngAfterViewInit() {
    this.reloadMaze(this.id);
    this.graph.turnLeft();
    this.graph.turnRight();
  }

  reloadMaze(id) {
    if (this.id == 1) { var maze = mazeMap.mazes.maze1; var mazeGoal = mazeEnd.maze1.goal; }
    else if (this.id == 2) { var maze = mazeMap.mazes.maze2; var mazeGoal = mazeEnd.maze2.goal;}
    else if (this.id == 3) { var maze = mazeMap.mazes.maze3; var mazeGoal = mazeEnd.maze3.goal;}
    else if (this.id == 4) { var maze = mazeMap.mazes.maze4; var mazeGoal = mazeEnd.maze4.goal;}
    else if (this.id == 5) { var maze = mazeMap.mazes.maze5; var mazeGoal = mazeEnd.maze5.goal;}
    else if (this.id == 6) { var maze = mazeMap.mazes.maze6; var mazeGoal = mazeEnd.maze6.goal;}
    else if (this.id == 7) { var maze = mazeMap.mazes.maze7; var mazeGoal = mazeEnd.maze7.goal;}
    else { var maze = mazeMap.mazes.emptyMaze; }
    eval("this.graph.drawMaze(maze,mazeGoal);");
  }

  log = '';

  public parseCodeInput(value: string): void {
    var code;
    // if (value.match(/for\((.*?)\){([\s\S]*?)}/g) != null) {
    //   // Matches For Loop
    //   code = value.match(/for\((.*?)\){([\s\S]*?)}/g);
    //   console.log(code);
    //   console.log(code.length);
    //   code = code.toString();
    // }
    // console.log(value);
    this.scenarioParser(value);
    var arrayofLines = value.split("\n");
    this.stack = []; // Clear array
    this.timeStack = [];
    this.totalTime = 0; // Clear timing
    console.log("Num of line break = " + arrayofLines.length);
    for (var i = 0; i < arrayofLines.length; i++) {
      this.log += `Line${i}: `;
      this.log += `${arrayofLines[i]}\n`;
      this.determineCmd1(arrayofLines[i], this.stack, this.timeStack);
    }

    console.log("Num of command: " + this.stack.length);

    // for(var i=0; i<this.stack.length; i++){
    //     console.log("command["+ i + "]: " + this.stack[i]);
    // }
  }

  test(): void {
    eval("this.graph.receiveCmd(this.stack,this.timeStack);");
  }

  test2(): void {
    // eval("this.graph.receiveCmd1(this.stack, this.timeStack);");
    eval("this.graph.scenario3D();");
  }

  test3(): void {
    eval("this.graph.turnRight(); this.graph.moveForward(75,500);")
  }

  forLoopTest(): void {
    eval("this.graph.forLoopCmd(this.stack, this.timeStack);");
  }

  reset(): void {
    console.log("reset function from hero-form");
    eval("this.graph.reset();");
  }

  stopRobot(): void {
    eval("this.graph.stopRobot();");
  }

  turnLeft(): void {
    eval("this.graph.turnLeft();");
  }

  turnRight(): void {
    eval("this.graph.turnRight();");
  }

  moveForward(): void {
    eval("this.graph.moveForward(75, 500);")
  }

  moveBackward(): void {
    eval("this.graph.moveBackward(75, 500);")
  }

  rightWallFollower(): void {
    eval("this.graph.finalScenario();")
  }

  private determineCmd(line: string, cmdStack: string[]): void {
    var value;
    var cmdStringStart = "setTimeout(() => { this.";
    var cmdStringEnd = "; }, ";
    var turnTiming = 1000;
    // if (line.match(/turnLeft/g) != null) {
    //   value = line.substr( (line.indexOf("(") + 1) );
    //   value = value.slice(0, value.indexOf(")"));
    //   cmdStack.push("turnLeft(" + value + ")");
    // } else if (line.match(/turnRight/g) != null) {
    //   value = line.substr( (line.indexOf("(") + 1) );
    //   value = value.slice(0, value.indexOf(")"));
    //   cmdStack.push("turnRight(" + value + ")");
    // } else if (line.match(/moveForward/g) != null) {
    //   value = line.substr( (line.indexOf("(") + 1) );
    //   value = value.slice(0, value.indexOf(")"));
    //   cmdStack.push("moveForward(" + value + "," + (value/1000) + ")");
    // } else if (line.match(/moveBackward/g) != null) {
    //   value = line.substr( (line.indexOf("(") + 1) );
    //   value = value.slice(0, value.indexOf(")"));
    //   cmdStack.push("moveBackward(" + value + "," + (value/1000) + ")");
    // }

    if (line.match(/turnLeft/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      // setTimeout(() => { this.graph.turnLeft(); }, 1000);
      cmdStack.push(cmdStringStart + "turnLeft()" + cmdStringEnd + this.totalTime + ");");
      this.totalTime += turnTiming;
    } else if (line.match(/turnRight/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "turnRight()" + cmdStringEnd + this.totalTime + ");");
      this.totalTime += turnTiming;
    } else if (line.match(/moveForward/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(","));
      var unit = value.slice(value.indexOf("."), value.indexOf(")"));
      cmdStack.push(cmdStringStart + "moveForward(" + value + "," + (value * 10) + ")"
        + cmdStringEnd + (this.totalTime) + ");");
      this.totalTime += (value * 10);
    } else if (line.match(/moveBackward/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "moveBackward(" + value + "," + (value * 10) + ")"
        + cmdStringEnd + (this.totalTime) + ");");
      this.totalTime += (value * 10);
    } else if (line.match(/sideThreshold =/g) != null) {
      value = line.substr((line.indexOf("=") + 1));
      cmdStack.push("sideThreshold=" + value);
    } else if (line.match(/frontThreshold =/g) != null) {
      value = line.substr((line.indexOf("=") + 1));
      cmdStack.push("frontThreshold=" + value);
    }
  }

  private determineCmd1(line: string, cmdStack: string[], timeStack: number[]): void {
    var value;
    var cmdStringStart = "parent.";
    var cmdStringEnd = "-";
    var turnTiming = 1000;

    if (line.match(/turnLeft/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "turnLeft()");
      timeStack.push(turnTiming);
      this.totalTime += turnTiming;
    } else if (line.match(/turnRight/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "turnRight()");
      timeStack.push(turnTiming);
      this.totalTime += turnTiming;
    } else if (line.match(/moveForward/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "moveForward(" + value + "," + (value * 10) + ")");
      timeStack.push(value * 10);
      this.totalTime += (value * 10);
    } else if (line.match(/moveBackward/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "moveBackward(" + value + "," + (value * 10) + ")");
      timeStack.push(value * 10);
      this.totalTime += (value * 10);
    } else if (line.match(/sideThreshold =/g) != null) {
      value = line.substr((line.indexOf("=") + 1));
      cmdStack.push("sideThreshold=" + value);
    } else if (line.match(/frontThreshold =/g) != null) {
      value = line.substr((line.indexOf("=") + 1));
      cmdStack.push("frontThreshold=" + value);
    } else if (line.match(/for\((.*?)\)/g) || line.match(/for \((.*?)\)/g) != null) {
      // Matches For Loop
      var value = line.substr((line.indexOf("=") + 1));
      var initial_num = value.slice(0, value.indexOf(";"));
      value = value.slice(value.indexOf("<") + 1);
      var condition_num = value.slice(0, value.indexOf(";"));
      console.log("initial num=" + initial_num + " | condition_num=" + condition_num);
      cmdStack.push("for-loop-start:(" + initial_num + "," + condition_num + ")");
    }
    else if (line.match(/while\((.*?)\)/g) || line.match(/while \((.*?)\)/g) != null) {
      // Matches While Loop
      var value = line.substr((line.indexOf("(") + 1));
      var initial_num = value.slice(0, value.indexOf(")"));
      console.log("while loop found value:" + initial_num);
    }
  }

  private evaluate_for_loop(cmdStack: string[]): string[] {
    if (line.match(/for\((.*?)\)/g) || line.match(/for \((.*?)\)/g) != null) {
      // Matches For Loop
      var value = line.substr((line.indexOf("=") + 1));
      var initial_num = value.slice(0, value.indexOf(";"));
      value = value.slice(value.indexOf("<") + 1);
      var condition_num = value.slice(0, value.indexOf(";"));
      console.log("initial num=" + initial_num + " | condition_num=" + condition_num);
      cmdStack.push("for-loop-start");
    }


  public scenarioParser(code: string): void {
    if(code.includes("while (steps < target_distance) {" )) {
      console.log("Inside scenario 1.4!");
    }
    else if(code.includes(`while (front_sensor > front_threshold) {\n    robot.moveForward(`) ||
            code.includes(`while (frontSensor > frontThreshold) {\n    robot.moveForward(`)){
      console.log("Inside scenario 2.1")
    }
    else if(code.includes(`while (true) {\n    if (front_sensor < front_threshold) {\n        robot.moveBackward(`) ||
            code.includes(`while (true) {\n    if (frontSensor < frontThreshold) {\n        robot.moveBackward(`) ||
            code.includes(`while (true) {\n    if (front_sensor > front_threshold) {\n        robot.moveForward(`) ||
            code.includes(`while (true) {\n    if (frontSensor > frontThreshold) {\n        robot.moveForward(`) ){
      console.log("Inside scenario 2.2!");
    }
    else if(code.includes(`while (true) {\n    if (front_sensor < front_threshold) {\n        robot.turnRight()`) ||
            code.includes(`while (true) {\n    if (frontSensor < frontThreshold) {\n        robot.turnRight()`) ){
      console.log("Inside scenario 2.3!");
    }
    else if(code.includes(`while (true) {\n    if (side_sensor > side_threshold) {\n        robot.turnRight()\n        robot.moveForward`) ||
            code.includes(`while (true) {\n    if (sideSensor > sideThreshold) {\n        robot.turnRight()\n        robot.moveForward`) ){
      console.log("Inside right wall follower!");
    }
  }



  }
