import { Component, OnInit, ElementRef, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { TestGraphComponent } from './graph.component';
import mazeMap from "./graph/maze/mazes";


@Component({
  selector: 'header-component',
  templateUrl: 'app/header.component.html'
})
export class HeaderComponent implements OnInit, OnChanges, AfterViewInit{
  @ViewChild(TestGraphComponent) graph:TestGraphComponent;

  public maze1(){
    eval("this.graph.drawMaze(mazeMap.mazes.maze3);");
  }
}
