import { Component, OnInit, ElementRef, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { Hero }    from './hero';
import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';

var sampleCode = `// Some js code...
if (true) {
  console.log('hello world');
}

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
    robot.moveForward(1000)
    robot.turnLeft(90)
    robot.turnLeft(900)
    robot.turnLeft(9000)
    robot.turnLeft(90000)
    robot.turnRight(90)
    robot.moveBackward(2000)
    robot.turnRight(180)
}
`;

@Component({
  moduleId: module.id,
  selector: 'hero-form',
  templateUrl: 'hero-form.component.html'
})
export class HeroFormComponent implements OnInit, OnChanges, AfterViewInit {

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
    let stack: string[] = new Array();
    var arrayofLines = value.split("\n");
    var leftCount = 0;
    console.log("Num of line break = " + arrayofLines.length);
    for (var i = 0; i < arrayofLines.length; i++) {
      this.log += `Line${i}: `;
      this.log += `${arrayofLines[i]}\n`;
      determineCmd(arrayofLines[i], stack);
      if (arrayofLines[i].match(/turnLeft/g) != null) {
        var strValue = arrayofLines[i]
          .substr((arrayofLines[i].indexOf("(") + 1));
        strValue = strValue.slice(0, strValue.indexOf(")"));
        // console.log("value :" + strValue);
        leftCount++;
      }
    }
    // console.log("Num of left turn: " + leftCount);
    console.log("Num of command: " + stack.length);
    for(var i=0; i<stack.length; i++){
        console.log("command["+ i + "]: " + stack[i]);
    }
  }

  function determineCmd(line: string, cmdStack: string[]): void {
      var value;
      if (line.match(/turnLeft/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push("left." + value);
      } else if (line.match(/turnRight/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push("right." + value);
      } else if (line.match(/moveForward/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push("forward." + value);
      } else if (line.match(/moveBackward/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push("backward." + value);
      }

    }

}
}
