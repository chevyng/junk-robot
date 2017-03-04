import { Component, OnInit, ElementRef, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { Hero }    from './hero';
import { TestGraphComponent } from './graph.component';
import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';

var sampleCode = `// Junk robot PXT JS code...
let robot: junkrobot.Robot = null
let sideSensor = junkrobot.ping(DigitalPin.P16, DigitalPin.P19)
let frontSensor = junkrobot.ping(DigitalPin.P5, DigitalPin.P20)
let sideThreshold = 10
let frontThreshold = 10
robot = junkrobot.createRobot(junkrobot.createMotor(
    DigitalPin.P0,
    DigitalPin.P0,
    DigitalPin.P0,
    DigitalPin.P0
), junkrobot.createMotor(
        DigitalPin.P0,
        DigitalPin.P0,
        DigitalPin.P0,
        DigitalPin.P0
    ))

while(true) {
  if(sideSensor > sideThreshold) {
    robot.turnRight()
    robot.moveForward(150)
  } else if(sideSensor < sideThreshold && frontSensor > frontThreshold){
    robot.moveForward(150)
  } else if(sideSensor < sideThreshold && frontSensor < frontThreshold){
    robot.turnLeft()
  }
}
    robot.turnRight()
    robot.moveForward(300)
    robot.turnLeft()
    robot.moveForward(150)
    robot.turnLeft()
    robot.moveForward(300)
    robot.turnRight()
    robot.moveForward(300)
    robot.turnRight()
    robot.moveForward(600)
    robot.turnRight()
    robot.moveForward(450)
    robot.turnLeft()
}
`;

@Component({
  moduleId: module.id,
  selector: 'hero-form',
  templateUrl: 'hero-form.component.html'
})
export class HeroFormComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(TestGraphComponent) graph:TestGraphComponent;

  private totalTime = 0;
  private stack: string[] = new Array();
  config = {
    lineNumbers: true,
    mode: {
      name: 'javascript',
      json: true
    },
    theme: 'abcdef'
  };
  code = sampleCode;
  submitted = false;
  onSubmit() { this.submitted = true; }
  resetForm() {
    this.code = `reset!`;
  }


  log = '';
  parseCodeInput(value: string): void {
    var arrayofLines = value.split("\n");
    this.stack = []; // Clear array
    this.totalTime = 0; // Clear timing
    console.log("Num of line break = " + arrayofLines.length);
    for (var i = 0; i < arrayofLines.length; i++) {
      this.log += `Line${i}: `;
      this.log += `${arrayofLines[i]}\n`;
      this.determineCmd(arrayofLines[i], this.stack);
    }
    console.log("Num of command: " + this.stack.length);
    // for(var i=0; i<this.stack.length; i++){
    //     console.log("command["+ i + "]: " + this.stack[i]);
    // }
  }

  testFunc(value: string): void{
    console.log("Test Function");
    this.parseCodeInput(value);
    // eval("this.graph.receiveCmd(this.stack);");
    for(var i=0; i<this.stack.length; i++){
      var t0 = performance.now();
      console.log("command["+ i + "]: " + this.stack[i]);
      eval(this.stack[i]);
      console.log("Command took: " + (performance.now() - t0));
    }
  }

  test(): void{
    eval("this.graph.receiveCmd(this.stack);");
    eval("this.graph.newMove(150);");
  }

  reset(): void{
    console.log("reset function from hero-form");
    eval("this.graph.reset();");
  }

  stopRobot(): void{
    eval("this.graph.stopRobot();");
  }

  turnLeft(): void{
    eval("this.graph.turnLeft();");
  }

  turnRight(): void{
    eval("this.graph.turnRight();");
  }

  moveForward(): void{
    eval("this.graph.moveForward(75, 500);")
  }

  moveBackward(): void{
    eval("this.graph.moveBackward(75, 500);")
  }

  private determineCmd(line: string, cmdStack: string[]): void {
      var value;
      var cmdStringStart = "setTimeout(() => { this.graph.";
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
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        // setTimeout(() => { this.graph.turnLeft(); }, 1000);
        cmdStack.push(cmdStringStart + "turnLeft()" + cmdStringEnd + this.totalTime + ");" );
        this.totalTime+=turnTiming;
      } else if (line.match(/turnRight/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push(cmdStringStart + "turnRight()" + cmdStringEnd + this.totalTime + ");" );
        this.totalTime+=turnTiming;
      } else if (line.match(/moveForward/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        //    setTimeout(() => { this.moveForward(200, 2); }, 2000);
        cmdStack.push(cmdStringStart + "moveForward(" + value + "," + (value*10) + ")"
        + cmdStringEnd + (this.totalTime) + ");" );
        this.totalTime+=(value*10);
      } else if (line.match(/moveBackward/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push(cmdStringStart + "moveBackward(" + value + "," + (value*10) + ")"
        + cmdStringEnd + (this.totalTime) + ");" );
        this.totalTime+=(value*10);
      } else if (line.match(/sideThreshold =/g) != null) {
        value = line.substr( (line.indexOf("=") + 1) );
        cmdStack.push("sideThreshold=" + value);
      } else if (line.match(/frontThreshold =/g) != null) {
        value = line.substr( (line.indexOf("=") + 1) );
        cmdStack.push("frontThreshold=" + value);
      }
    }



}
}
