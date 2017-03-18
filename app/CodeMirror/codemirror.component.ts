import { Component, OnInit, ElementRef, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import dummyCodes from "./dummyCodes";

import 'codemirror/mode/clike/clike';
import 'codemirror/lib/codemirror';
import 'codemirror/mode/javascript/javascript';

@Component({
  selector: 'codemirror-component',
  template: `
    <div class="row">
      <div class="col">
        <button type="button" class="btn btn-danger" (click)="resetForm(); heroForm.reset()">Clear Code</button>
        <button type="button" class="btn btn-primary" (click)="parseCodeInput(codemirror.value)">Parse</button>
        <button type="button" class="btn btn-success" (click)="testFunc(codemirror.value);"> Run </button>
      </div>
    </div>
    <div class="col code-mirror">
      <!-- <label for="codeMirror">Editor</label> -->
      <br>
        <codemirror #codemirror
         [(ngModel)]="code"
         [config]="config"
         id="codemirror"
         name="codemirror"
         >
        </codemirror>
        <br>
        <!-- <pre>{{code}}</pre> -->
    </div>
  `
})
export class CodeMirrorComponent {
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
}
