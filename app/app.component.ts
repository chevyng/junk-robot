import { Component } from '@angular/core';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';


@Component({
  selector: 'my-app',
  template: `
    <header-component></header-component>
    <router-outlet></router-outlet>
    <footer-component></footer-component>
  `
})
export class AppComponent { }
