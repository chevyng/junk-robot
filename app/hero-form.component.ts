import { Component, OnInit, ElementRef, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { Hero }    from './hero';
import { TestGraphComponent } from './graph.component';
import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';

var sampleCode = `// Junk robot PXT JS code...
let robot: junkrobot.Robot = null
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
for (let i = 0; i < 4; i++) {
    robot.moveForward(125)
    robot.turnLeft()
    robot.moveForward(250)
    robot.turnRight()
    robot.moveForward(250)
    robot.turnRight()
    robot.moveForward(375)
    robot.turnRight()
    robot.moveForward(250)
    robot.moveBackward(125)
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
    // let stack: string[] = new Array();
    var arrayofLines = value.split("\n");
    var leftCount = 0;
    this.stack = []; // Clear array
    this.totalTime = 0; // Clear timing
    console.log("Num of line break = " + arrayofLines.length);
    for (var i = 0; i < arrayofLines.length; i++) {
      this.log += `Line${i}: `;
      this.log += `${arrayofLines[i]}\n`;
      this.determineCmd(arrayofLines[i], this.stack);
      if (arrayofLines[i].match(/turnLeft/g) != null) {
        var strValue = arrayofLines[i]
          .substr((arrayofLines[i].indexOf("(") + 1));
        strValue = strValue.slice(0, strValue.indexOf(")"));
        // console.log("value :" + strValue);
        leftCount++;
      }
    }
    // console.log("Num of left turn: " + leftCount);
    console.log("Num of command: " + this.stack.length);
    // for(var i=0; i<this.stack.length; i++){
    //     console.log("command["+ i + "]: " + this.stack[i]);
    // }
  }

  testFunc(): void{
    console.log("Test Function");
    for(var i=0; i<this.stack.length; i++){
      console.log("command["+ i + "]: " + this.stack[i]);
      eval(this.stack[i]);
    }
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
      }
    }



}
}
