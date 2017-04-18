import { Component, OnInit, ElementRef, OnChanges,
         AfterViewInit, ViewChild, AfterContent } from '@angular/core';
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
  private forLoop = 0;
  private whileLoop = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    route.params.subscribe(param => {
      this.id = param['id'];
      if (this.loadCount != 0) {
        this.router.navigateByUrl('').then(
          () => {
            this.router.navigateByUrl('maze/' + this.id);
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
    theme: 'abcdef',
    indentUnit: 4
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
    });
  }

  ngAfterViewInit() {
    this.reloadMaze(this.id);
    this.graph.turnLeft();
    this.graph.turnRight();
  }

  reloadMaze(id) {
    if (this.id == 1) { var maze = mazeMap.mazes.maze1; var mazeGoal = mazeEnd.maze1.goal; var mazeGoalName = mazeEnd.maze1.name; }
    else if (this.id == 2) { var maze = mazeMap.mazes.maze2; var mazeGoal = mazeEnd.maze2.goal; var mazeGoalName = mazeEnd.maze2.name; }
    else if (this.id == 3) { var maze = mazeMap.mazes.maze3; var mazeGoal = mazeEnd.maze3.goal; var mazeGoalName = mazeEnd.maze3.name; }
    else if (this.id == 4) { var maze = mazeMap.mazes.maze4; var mazeGoal = mazeEnd.maze4.goal; var mazeGoalName = mazeEnd.maze4.name; }
    else if (this.id == 5) { var maze = mazeMap.mazes.maze5; var mazeGoal = mazeEnd.maze5.goal; var mazeGoalName = mazeEnd.maze5.name; }
    else if (this.id == 6) { var maze = mazeMap.mazes.maze6; var mazeGoal = mazeEnd.maze6.goal; var mazeGoalName = mazeEnd.maze6.name; }
    else if (this.id == 7) { var maze = mazeMap.mazes.maze7; var mazeGoal = mazeEnd.maze7.goal; var mazeGoalName = mazeEnd.maze7.name; }
    else { var maze = mazeMap.mazes.emptyMaze; }
    eval("this.graph.drawMaze(maze,mazeGoal,mazeGoalName);");
  }

  log = '';

  public parseCodeInput(value: string): void {
    //ScenarioParser returns 1 if it doesn't match any of the scenario
    if (this.scenarioParser(value) == 1) {
      var arrayofLines = value.split("\n");
      this.stack = []; // Clear array
      this.timeStack = [];
      this.totalTime = 0; // Clear timing
      this.forLoop = 0;
      this.whileLoop = 0;
      for (var i = 0; i < arrayofLines.length; i++) {
        this.log += `Line${i}: `;
        this.log += `${arrayofLines[i]}\n`;
        this.determineCmd(arrayofLines[i], this.stack, this.timeStack);
      }

      if (this.forLoop == 1) {
        this.graph.for_loop_cmd_found(this.stack, this.timeStack);
      } else if (this.whileLoop == 1) {
        this.graph.while_loop_cmd_found(this.stack, this.timeStack);
      } else {
        this.graph.receiveCmd1(this.stack, this.timeStack);
      }
    }
  }


  reset(): void {
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

  private determineCmd(line: string, cmdStack: string[], timeStack: number[]): void {
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
    }
    else if (line.match(/turnRight/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "turnRight()");
      timeStack.push(turnTiming);
      this.totalTime += turnTiming;
    }
    else if (line.match(/moveForward/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "moveForward(" + value + "," + (value * 10) + ")");
      timeStack.push(value * 10);
      this.totalTime += (value * 10);
    }
    else if (line.match(/moveBackward/g) != null) {
      value = line.substr((line.indexOf("(") + 1));
      value = value.slice(0, value.indexOf(")"));
      cmdStack.push(cmdStringStart + "moveBackward(" + value + "," + (value * 10) + ")");
      timeStack.push(value * 10);
      this.totalTime += (value * 10);
    }
    else if (line.match(/for\((.*?)\)/g) || line.match(/for \((.*?)\)/g) != null) {
      // Matches For Loop
      var value = line.substr((line.indexOf("=") + 1));
      var initial_num = value.slice(0, value.indexOf(";"));
      value = value.slice(value.indexOf("<") + 1);
      var condition_num = value.slice(0, value.indexOf(";"));
      cmdStack.push("for-loop-start:(" + initial_num + "," + condition_num + ")");
      this.forLoop = 1;
    }
    else if (line.match(/while\((.*?)\)/g) || line.match(/while \((.*?)\)/g) != null) {
      // Matches While Loop
      var value = line.substr((line.indexOf("(") + 1));
      var initial_num = value.slice(0, value.indexOf(")"));
      this.whileLoop = 1;
    }
  }

  public scenarioParser(code: string): number {
    code = code.replace(/\s/g, '');
    if (code.includes("while(steps<target_distance")) {
      var value = code.slice((code.indexOf("target_distance=") + 16), code.indexOf("target_distance=") + 20);
      value = value.replace(/\D/g, '');
      this.graph.scenario2D(value / 27);
      return 0;
    }
    else if (code.includes(`while(front_sensor>front_threshold){robot.moveForward(`) ||
      code.includes(`while(frontSensor>frontThreshold){robot.moveForward(`)) {
      if (code.match(/frontThreshold/g)) {
        var value = code.slice((code.indexOf("frontThreshold=") + 15), code.indexOf("frontThreshold=") + 17));
      } else if (code.match(/front_threshold/g)) {
        var value = code.slice((code.indexOf("front_threshold=") + 16), code.indexOf("front_threshold=") + 18));
      }

      this.graph.scenario3B(value);
      return 0;
    }
    else if (code.includes(`while(true){if(front_sensor<front_threshold){robot.moveBackward(`) ||
      code.includes(`while(true){if(frontSensor<frontThreshold){robot.moveBackward(`) ||
      code.includes(`while(true){if(front_sensor>front_threshold){robot.moveForward(`) ||
      code.includes(`while(true){if(frontSensor>frontThreshold){robot.moveForward(`)) {
      if (code.match(/frontThreshold/g)) {
        var value = code.slice((code.indexOf("frontThreshold=") + 15), code.indexOf("frontThreshold=") + 17));
      } else if (code.match(/front_threshold/g)) {
        var value = code.slice((code.indexOf("front_threshold=") + 16), code.indexOf("front_threshold=") + 18));
      }

      this.graph.scenario3C(value);
      return 0;
    }
    else if (code.includes(`while(true){if(front_sensor<front_threshold){robot.turnRight()`) ||
      code.includes(`while(true){if(frontSensor<frontThreshold){robot.turnRight()`)) {
      if (code.match(/frontThreshold/g)) {
        var value = code.slice((code.indexOf("frontThreshold=") + 15), code.indexOf("frontThreshold=") + 17));
      } else if (code.match(/front_threshold/g)) {
        var value = code.slice((code.indexOf("front_threshold=") + 16), code.indexOf("front_threshold=") + 18));
      }
      this.graph.scenario3D(value);
      return 0;
    }
    else if (code.includes(`while(true){if(side_sensor>side_threshold){robot.turnRight()robot.moveForward`) ||
      code.includes(`while(true){if(sideSensor>sideThreshold){robot.turnRight()robot.moveForward`)) {
      this.graph.finalScenario();
      return 0;
    } else {
      return 1;
    }
  }
}
