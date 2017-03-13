import { Component } from '@angular/core';
import { HeaderComponent } from './header.component';


@Component({
  selector: 'my-app',
  template: `
    <header-component></header-component>
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
