import { Component, OnInit, ElementRef, OnChanges, AfterViewInit } from '@angular/core';
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
}


`;

@Component({
  moduleId: module.id,
  selector: 'hero-form',
  templateUrl: 'hero-form.component.html'
})
export class HeroFormComponent {
  powers = ['Really Smart', 'Super Flexible',
    'Super Hot', 'Weather Changer'];
  model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');
  submitted = false;
  onSubmit() { this.submitted = true; }
  resetForm() {
    this.code = `reset!`;
  }

  log = '';
  parseInput(value: string): void {
    this.log += ` ${value} \n`
  }

  config = {
    lineNumbers: true,
    mode: {
      name: 'javascript',
      json: true
    },
    theme: 'abcdef'
  };

  code = sampleCode;
  codeMirror = require("codemirror");

}
