import { Component, ElementRef, OnInit, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'd3-graph',
  template: `
    <div #myDiv></div>`
})
export class TestGraphComponent implements OnInit, OnChanges, AfterViewInit {

  private el: any;
  private host;
  private height;
  private width;

  // @ViewChild('myDiv') myDiv;

  constructor(element: ElementRef) {
    this.el = element;
  }

  ngOnInit() {
    this.setup();
  }

  ngAfterViewInit() {
    console.log("Is this executed?");
    var svg = d3.select(this.el.nativeElement).select("div")
        .append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("background-color", "yellow");

      var y = d3.scaleLinear()
        .domain([0,400])
        .range([400,0]);

      var x = d3.scaleLinear()
        .domain([0,400])
        .range([0,400]);

      // var xAxis = d3.svg.axis()
      //   .scale(x)
      //   .orient("bottom");



      // svg.append("g")
      //   .call(xAxis);

  }

  private setup(): void {
    this.width = 500;
    this.height = 500;
  }
}
