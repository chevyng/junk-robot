import { Component, OnInit, ElementRef, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Hero }    from './hero';
import { TestGraphComponent } from './graph.component';
import { HeaderComponent } from './header.component';
import dummyCodes from "./dummyCodes";
import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';

@Component({
  moduleId: module.id,
  selector: 'hero-form',
  templateUrl: 'hero-form.component.html',
  styleUrls : ['hero-form.component.css']
})
export class HeroFormComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(TestGraphComponent) graph:TestGraphComponent;

  private totalTime = 0;
  private stack: string[] = new Array();
  private timeStack: number[] = new Array();
  config = {
    lineNumbers: true,
    mode: {
      name: 'javascript',
      json: true
    },
    theme: 'abcdef'
  };
  // code = sampleCode;
  code = dummyCodes.sampleCode;
  submitted = false;
  onSubmit() { this.submitted = true; }
  resetForm() {
    this.code = `reset!`;
  }


  log = '';
  parseCodeInput(value: string): void {
    var code;
    if(value.match(/for\((.*?)\){([\s\S]*?)}/g) != null) {
      // Matches For Loop
      code = value.match(/for\((.*?)\){([\s\S]*?)}/g);
      console.log(code);
      console.log(code.length);
      code = code.toString();
    }

    var arrayofLines = code.split("\n");
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
    eval("this.graph.receiveCmd(this.stack,this.timeStack);");
  }

  test2(): void{
    eval("this.graph.receiveCmd1(this.stack, this.timeStack);");
  }

  forLoopTest(): void{
    eval("this.graph.receiveCmd2(this.stack, this.timeStack);");
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

  rightWallFollower(): void{
    eval("this.graph.rightWallFollower1();")
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

  private determineCmd1(line: string, cmdStack: string[], timeStack: number[]): void {
      var value;
      var cmdStringStart = "parent.";
      var cmdStringEnd = "-";
      var turnTiming = 1000;

      if (line.match(/turnLeft/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push(cmdStringStart + "turnLeft()");
        timeStack.push(turnTiming);
        this.totalTime+=turnTiming;
      } else if (line.match(/turnRight/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push(cmdStringStart + "turnRight()");
        timeStack.push(turnTiming);
        this.totalTime+=turnTiming;
      } else if (line.match(/moveForward/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push(cmdStringStart + "moveForward(" + value + "," + (value*10) + ")" );
        timeStack.push(value*10);
        this.totalTime+=(value*10);
      } else if (line.match(/moveBackward/g) != null) {
        value = line.substr( (line.indexOf("(") + 1) );
        value = value.slice(0, value.indexOf(")"));
        cmdStack.push(cmdStringStart + "moveBackward(" + value + "," + (value*10) + ")" );
        timeStack.push(value*10);
        this.totalTime+=(value*10);
      } else if (line.match(/sideThreshold =/g) != null) {
        value = line.substr( (line.indexOf("=") + 1) );
        cmdStack.push("sideThreshold=" + value);
      } else if (line.match(/frontThreshold =/g) != null) {
        value = line.substr( (line.indexOf("=") + 1) );
        cmdStack.push("frontThreshold=" + value);
      } else if(line.match(/for\((.*?)\)/g) || line.match(/for \((.*?)\)/g) != null) {
        // Matches For Loop
        var value = line.substr((line.indexOf("=") + 1));
        var initial_num = value.slice(0, value.indexOf(";"));
        value = value.slice(value.indexOf("<") + 1);
        var condition_num = value.slice(0, value.indexOf(";"));
        console.log("initial num=" + initial_num + " | condition_num=" + condition_num);
        cmdStack.push("for-loop-start:(" + initial_num + "," + condition_num + ")");
      } else if(line.match(/while\((.*?)\)/g) || line.match(/while \((.*?)\)/g) != null) {
        // Matches While Loop
        var value = line.substr((line.indexOf("(") + 1));
        var initial_num = value.slice(0, value.indexOf(")"));
        console.log("while loop found value:" + initial_num);
      }
    }

  private evaluate_for_loop(cmdStack: string[]): string[]{
    if(line.match(/for\((.*?)\)/g) || line.match(/for \((.*?)\)/g) != null) {
      // Matches For Loop
      var value = line.substr((line.indexOf("=") + 1));
      var initial_num = value.slice(0, value.indexOf(";"));
      value = value.slice(value.indexOf("<") + 1);
      var condition_num = value.slice(0, value.indexOf(";"));
      console.log("initial num=" + initial_num + " | condition_num=" + condition_num);
      cmdStack.push("for-loop-start");
  }



}
