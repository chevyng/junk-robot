import { Component } from '@angular/core';

@Component({
  selector: 'about-component',
  template: `
    <div class="container">
      <div class="card text-center">
        <div class="card-header">
          Featured
        </div>
        <div class="card-block">
          <h4 class="card-title">About Junk Robot Simulator</h4>
          <p class="card-text">This junk robot simulator is made by Chevy Ng from University College London</p>
          <p class="card-text">Final Year Project: "Designing Junk Robot using BBC micro:bit for High Schoolers"</p>
        </div>
      </div>
      <h2></h2>
      <p></p>
    </div>
  `
})
export class AboutComponent{}
